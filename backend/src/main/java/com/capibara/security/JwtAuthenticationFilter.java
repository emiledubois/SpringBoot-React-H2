package com.capibara.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Filtro JWT - VERSIÓN DEFINITIVA
 * Compatible con JJWT 0.11.5
 * CORRIGE: Error "Access Denied" en login
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Value("${jwt.secret}")
    private String jwtSecret;

    /**
     * RUTAS PÚBLICAS - SIN "/" AL FINAL
     * CRÍTICO: "/api/auth" NO "/api/auth/"
     */
    private static final List<String> PUBLIC_PATHS = Arrays.asList(
        "/api/auth",        // ✓ Login y registro
        "/swagger-ui",      // ✓ Swagger UI
        "/v3/api-docs",     // ✓ OpenAPI docs
        "/h2-console",      // ✓ H2 Console
        "/actuator",        // ✓ Actuator
        "/error"            // ✓ Error handler
    );

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        try {
            String requestPath = request.getRequestURI();
            String method = request.getMethod();

            logger.debug("═══════════════════════════════════");
            logger.debug("🔍 FILTRO JWT - REQUEST RECIBIDO");
            logger.debug("═══════════════════════════════════");
            logger.debug("Método: {}", method);
            logger.debug("Ruta: {}", requestPath);

            // ═══════════════════════════════════════════════════
            // PASO 1: Permitir OPTIONS (CORS preflight)
            // ═══════════════════════════════════════════════════
            if ("OPTIONS".equalsIgnoreCase(method)) {
                logger.debug("✓ Request OPTIONS - CORS preflight permitido");
                filterChain.doFilter(request, response);
                return;
            }

            // ═══════════════════════════════════════════════════
            // PASO 2: Verificar si es RUTA PÚBLICA
            // ═══════════════════════════════════════════════════
            boolean isPublic = isPublicPath(requestPath);
            
            if (isPublic) {
                logger.debug("✓✓✓ RUTA PÚBLICA DETECTADA ✓✓✓");
                logger.debug("✓ Permitiendo acceso SIN JWT");
                logger.debug("═══════════════════════════════════");
                filterChain.doFilter(request, response);
                return;
            }

            // ═══════════════════════════════════════════════════
            // PASO 3: CASO ESPECIAL - GET /api/products es público
            // ═══════════════════════════════════════════════════
            if ("GET".equalsIgnoreCase(method) && requestPath.startsWith("/api/products")) {
                logger.debug("✓ GET /api/products - público SIN JWT");
                logger.debug("═══════════════════════════════════");
                filterChain.doFilter(request, response);
                return;
            }

            // ═══════════════════════════════════════════════════
            // PASO 4: RUTA PROTEGIDA - Requiere JWT
            // ═══════════════════════════════════════════════════
            logger.debug("⚠️  RUTA PROTEGIDA - Verificando JWT");
            
            String token = extractTokenFromRequest(request);

            if (token == null) {
                logger.warn("✗ NO hay token JWT en headers");
                logger.debug("═══════════════════════════════════");
                filterChain.doFilter(request, response);
                return;
            }

            logger.debug("✓ Token JWT encontrado: {}...", token.substring(0, Math.min(20, token.length())));

            // ═══════════════════════════════════════════════════
            // PASO 5: Validar y procesar token
            // ═══════════════════════════════════════════════════
            if (validateToken(token)) {
                String username = extractUsername(token);
                List<String> roles = extractRoles(token);

                logger.debug("✓✓✓ TOKEN VÁLIDO ✓✓✓");
                logger.debug("✓ Usuario: {}", username);
                logger.debug("✓ Roles: {}", roles);

                // Crear autenticación
                List<SimpleGrantedAuthority> authorities = roles.stream()
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(username, null, authorities);

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);

                logger.debug("✓ Usuario AUTENTICADO correctamente");
            } else {
                logger.warn("✗ Token JWT INVÁLIDO o EXPIRADO");
            }

            logger.debug("═══════════════════════════════════");

        } catch (ExpiredJwtException e) {
            logger.error("✗ Token JWT EXPIRADO: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            logger.error("✗ Token JWT MALFORMADO: {}", e.getMessage());
        } catch (SignatureException e) {
            logger.error("✗ Firma JWT INVÁLIDA: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("✗ Token JWT NO SOPORTADO: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("✗ Token JWT VACÍO: {}", e.getMessage());
        } catch (Exception e) {
            logger.error("✗ ERROR INESPERADO: {}", e.getMessage(), e);
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Verificar si la ruta es pública
     */
    private boolean isPublicPath(String requestPath) {
        for (String publicPath : PUBLIC_PATHS) {
            if (requestPath.startsWith(publicPath)) {
                logger.debug("   → Comparando '{}' con '{}'", requestPath, publicPath);
                logger.debug("   → ✓ COINCIDE - Es ruta pública");
                return true;
            }
        }
        logger.debug("   → NO es ruta pública - Requiere JWT");
        return false;
    }

    /**
     * Extraer token del header Authorization
     */
    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");

        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }

        return null;
    }

    // ════════════════════════════════════════════════════════════════
    // MÉTODOS COMPATIBLES CON JJWT 0.11.5
    // ════════════════════════════════════════════════════════════════

    /**
     * Validar token JWT
     * COMPATIBLE CON JJWT 0.11.5
     */
    private boolean validateToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));

            // ✓ JJWT 0.11.5 usa parserBuilder()
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);

            return true;

        } catch (Exception e) {
            logger.debug("Token inválido: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Extraer username del token
     * COMPATIBLE CON JJWT 0.11.5
     */
    private String extractUsername(String token) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));

        // ✓ JJWT 0.11.5 usa parserBuilder() y getBody()
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    /**
     * Extraer roles del token
     * COMPATIBLE CON JJWT 0.11.5
     */
    @SuppressWarnings("unchecked")
    private List<String> extractRoles(String token) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));

        // ✓ JJWT 0.11.5 usa parserBuilder() y getBody()
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return (List<String>) claims.get("roles");
    }
}