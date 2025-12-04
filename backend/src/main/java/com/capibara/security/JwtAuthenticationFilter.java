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
 * Filtro JWT que intercepta cada request para validar tokens
 * Compatible con JJWT 0.11.x y 0.12.x
 *  Sistema de autenticación seguro
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Value("${jwt.secret}")
    private String jwtSecret;

    /**
     * RUTAS PÚBLICAS - No requieren JWT
     * IMPORTANTE: Sin "/" al final para que coincida con rutas reales
     */
    private static final List<String> PUBLIC_PATHS = Arrays.asList(
        "/api/auth",           // Login y registro
        "/swagger-ui",         // Swagger UI
        "/v3/api-docs",        // OpenAPI docs
        "/h2-console",         // H2 Console
        "/actuator",           // Spring Actuator
        "/error"               // Error handler
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

            logger.debug("=== FILTRO JWT ===");
            logger.debug("Método: {}", method);
            logger.debug("Ruta: {}", requestPath);

            // PASO 1: Permitir OPTIONS (CORS preflight)
            if ("OPTIONS".equalsIgnoreCase(method)) {
                logger.debug(" Request OPTIONS - CORS preflight permitido");
                filterChain.doFilter(request, response);
                return;
            }

            // PASO 2: Verificar si es ruta pública
            if (isPublicPath(requestPath)) {
                logger.debug(" Ruta pública permitida: {}", requestPath);
                filterChain.doFilter(request, response);
                return;
            }

            // PASO 3: CASO ESPECIAL - GET /api/products es público
            if ("GET".equalsIgnoreCase(method) && requestPath.startsWith("/api/products")) {
                logger.debug(" GET /api/products es público - permitido sin JWT");
                filterChain.doFilter(request, response);
                return;
            }

            // PASO 4: Para rutas protegidas, extraer y validar JWT
            logger.debug(" Ruta protegida - requiere JWT");

            String token = extractTokenFromRequest(request);

            if (token == null) {
                logger.warn(" Token JWT no encontrado en headers");
                filterChain.doFilter(request, response);
                return;
            }

            logger.debug(" Token encontrado: {}", token.substring(0, Math.min(20, token.length())) + "...");

            // PASO 5: Validar y procesar token
            if (validateToken(token)) {
                String username = extractUsername(token);
                List<String> roles = extractRoles(token);

                logger.debug(" Token válido para usuario: {}", username);
                logger.debug(" Roles: {}", roles);

                // Crear autenticación
                List<SimpleGrantedAuthority> authorities = roles.stream()
                        .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                        .collect(Collectors.toList());

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(username, null, authorities);

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);

                logger.debug(" Usuario autenticado correctamente");
            } else {
                logger.warn(" Token JWT inválido o expirado");
            }

        } catch (ExpiredJwtException e) {
            logger.error(" Token JWT expirado: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            logger.error(" Token JWT malformado: {}", e.getMessage());
        } catch (SignatureException e) {
            logger.error(" Firma JWT inválida: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error(" Token JWT no soportado: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error(" Token JWT vacío o nulo: {}", e.getMessage());
        } catch (Exception e) {
            logger.error(" Error inesperado en filtro JWT: {}", e.getMessage(), e);
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Verificar si la ruta es pública (no requiere JWT)
     */
    private boolean isPublicPath(String requestPath) {
        for (String publicPath : PUBLIC_PATHS) {
            if (requestPath.startsWith(publicPath)) {
                return true;
            }
        }
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

    /**
     * Validar token JWT
     * Compatible con JJWT 0.11.x y 0.12.x
     */
    private boolean validateToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));

            // Método compatible con ambas versiones
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
     * Compatible con JJWT 0.11.x y 0.12.x
     */
    private String extractUsername(String token) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));

        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    /**
     * Extraer roles del token
     * Compatible con JJWT 0.11.x y 0.12.x
     */
    @SuppressWarnings("unchecked")
    private List<String> extractRoles(String token) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));

        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return (List<String>) claims.get("roles");
    }
}