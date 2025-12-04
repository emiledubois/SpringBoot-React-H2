package com.capibara.config;

import com.capibara.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * Configuración de Seguridad - VERSIÓN CON ORDERS
 * Permite crear órdenes con JWT
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserDetailsService userDetailsService;

    /**
     * Configuración CORS
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:5173",
                "http://localhost:3000",
                "http://localhost:5174",
                "http://localhost:8081"
        ));
        
        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"
        ));
        
        configuration.setAllowedHeaders(Arrays.asList("*"));
        
        configuration.setExposedHeaders(Arrays.asList(
                "Authorization", 
                "Access-Control-Allow-Origin",
                "Access-Control-Allow-Credentials"
        ));
        
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }

    /**
     * Cadena de filtros de seguridad
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                
                // CSRF deshabilitado (API REST)
                .csrf(csrf -> csrf.disable())
                
                // Configuración de autorización
                .authorizeHttpRequests(auth -> auth
                        // ═══════════════════════════════════════════════════
                        // RUTAS PÚBLICAS (sin autenticación)
                        // ═══════════════════════════════════════════════════
                        .requestMatchers(
                                "/api/auth/**",           // Login y registro
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**",
                                "/h2-console/**",
                                "/actuator/**",
                                "/error"
                        ).permitAll()
                        
                        // GET /api/products es público (ver productos sin login)
                        .requestMatchers(HttpMethod.GET, "/api/products").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                        
                        // ═══════════════════════════════════════════════════
                        // RUTAS DE ADMINISTRADOR (requiere ROLE_ADMIN)
                        // ═══════════════════════════════════════════════════
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        
                        // POST, PUT, DELETE /api/products requiere ADMIN
                        .requestMatchers(HttpMethod.POST, "/api/products").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/products/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasRole("ADMIN")
                        
                        // ═══════════════════════════════════════════════════
                        // RUTAS DE ÓRDENES (requiere autenticación)
                        // ═══════════════════════════════════════════════════
                        // Crear orden: cualquier usuario autenticado
                        .requestMatchers(HttpMethod.POST, "/api/orders").authenticated()
                        
                        // Ver mis órdenes: cualquier usuario autenticado
                        .requestMatchers(HttpMethod.GET, "/api/orders/my").authenticated()
                        
                        // Ver todas las órdenes: solo ADMIN
                        .requestMatchers(HttpMethod.GET, "/api/orders").hasRole("ADMIN")
                        
                        // Ver/actualizar orden específica: solo ADMIN
                        .requestMatchers(HttpMethod.GET, "/api/orders/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/orders/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/orders/**").hasRole("ADMIN")
                        
                        // ═══════════════════════════════════════════════════
                        // RUTAS DE CARRITO (requiere autenticación)
                        // ═══════════════════════════════════════════════════
                        .requestMatchers("/api/cart/**").authenticated()
                        
                        // ═══════════════════════════════════════════════════
                        // TODAS LAS DEMÁS RUTAS (requiere autenticación)
                        // ═══════════════════════════════════════════════════
                        .anyRequest().authenticated()
                )
                
                // Sesiones stateless (JWT)
                .sessionManagement(session -> 
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                
                // Authentication provider
                .authenticationProvider(authenticationProvider())
                
                // Agregar filtro JWT
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                
                // Permitir frames de mismo origen (H2 Console)
                .headers(headers -> headers
                        .frameOptions(frame -> frame.sameOrigin())
                );

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}