package com.capibara.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

/**
 * Filtro para autenticación JWT
 *  Autenticación JWT
 * 
 * Este filtro intercepta todas las peticiones HTTP y:
 * 1. Verifica si la ruta es pública (no requiere autenticación)
 * 2. Si no es pública, valida el token JWT
 * 3. Si el token es válido, establece la autenticación en el contexto
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    /**
     * Lista de rutas públicas que NO requieren JWT
     * Estas rutas son accesibles sin autenticación
     */
    private static final List<String> PUBLIC_PATHS = Arrays.asList(
            "/api/auth",          // Todas las rutas de autenticación (/login, /register)
          //  "/api/products",      // Productos - GET público, POST/PUT/DELETE requiere auth
            "/swagger-ui",        // Swagger UI
            "/v3/api-docs",       // OpenAPI docs
            "/h2-console",        // H2 Console (solo desarrollo)
            "/actuator",          // Spring Actuator
            "/error"              // Página de error
    );

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // Obtener la ruta de la petición
        String requestPath = request.getServletPath();
        String method = request.getMethod();

        // PASO 1: Permitir requests OPTIONS (CORS preflight)
        if ("OPTIONS".equalsIgnoreCase(method)) {
            filterChain.doFilter(request, response);
            return;
        }

        // PASO 2: Verificar si es una ruta pública
        if (isPublicPath(requestPath)) {
            logger.debug("Ruta pública detectada: " + requestPath + " - Saltando validación JWT");
            filterChain.doFilter(request, response);
            return;
        }

        // PASO 3: Obtener el header Authorization
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // Si no hay header Authorization o no empieza con "Bearer ", continuar sin autenticar
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.debug("No se encontró token JWT en la petición a: " + requestPath);
            filterChain.doFilter(request, response);
            return;
        }

        // PASO 4: Extraer el token (quitar "Bearer " del inicio)
        jwt = authHeader.substring(7);
        
        try {
            // PASO 5: Extraer el email del usuario del token
            userEmail = jwtService.extractUsername(jwt);

            // PASO 6: Si hay email y no hay autenticación previa en el contexto
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                
                // Cargar los detalles del usuario desde la base de datos
                UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);

                // PASO 7: Validar el token
                if (jwtService.validateToken(jwt, userDetails)) {
                    // Token válido - Crear objeto de autenticación
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    
                    // Agregar detalles adicionales de la petición
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    
                    // PASO 8: Establecer la autenticación en el contexto de seguridad
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    
                    logger.debug("Usuario autenticado exitosamente: " + userEmail + " para ruta: " + requestPath);
                } else {
                    logger.warn("Token JWT inválido para usuario: " + userEmail);
                }
            }
        } catch (Exception e) {
            logger.error("Error al procesar token JWT: " + e.getMessage());
            // No lanzamos la excepción, dejamos que Spring Security maneje el error
        }

        // PASO 9: Continuar con la cadena de filtros
        filterChain.doFilter(request, response);
    }

    /**
     * Verifica si la ruta es pública (no requiere autenticación)
     * 
     * @param path Ruta de la petición
     * @return true si es pública, false si requiere autenticación
     */
    private boolean isPublicPath(String path) {
        // Verificar si la ruta comienza con alguna de las rutas públicas
        boolean isPublic = PUBLIC_PATHS.stream()
                .anyMatch(publicPath -> path.startsWith(publicPath));
        
        if (isPublic) {
            logger.debug("Ruta pública: " + path);
        }
        
        return isPublic;
    }
}