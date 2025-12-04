package com.capibara.config;

import com.capibara.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
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
import java.util.List;

/**
 * Configuración de seguridad con JWT
 * IE3.3.1 - Sistema de autenticación seguro
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Deshabilitar CSRF (usamos JWT)
            .csrf(AbstractHttpConfigurer::disable)

            // Configurar CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // Configurar autorización de rutas
            .authorizeHttpRequests(auth -> auth
                // ============================================
                // RUTAS PÚBLICAS (sin autenticación)
                // ============================================
                .requestMatchers("/api/auth/**").permitAll()           // Login y registro
                .requestMatchers("/swagger-ui/**").permitAll()         // Swagger UI
                .requestMatchers("/v3/api-docs/**").permitAll()        // OpenAPI docs
                .requestMatchers("/h2-console/**").permitAll()         // H2 Console
                .requestMatchers("/actuator/**").permitAll()           // Actuator
                .requestMatchers("/error").permitAll()                 // Error handler

                // ============================================
                // PRODUCTOS - Permisos por método HTTP
                // ============================================
                .requestMatchers("GET", "/api/products/**").permitAll()           // Ver productos: público
                .requestMatchers("POST", "/api/products/**").hasRole("ADMIN")     // Crear: solo ADMIN
                .requestMatchers("PUT", "/api/products/**").hasRole("ADMIN")      // Editar: solo ADMIN
                .requestMatchers("DELETE", "/api/products/**").hasRole("ADMIN")   // Eliminar: solo ADMIN

                // ============================================
                // ÓRDENES - Solo usuarios autenticados
                // ============================================
                .requestMatchers("/api/orders/**").hasAnyRole("USER", "ADMIN")

                // ============================================
                // USUARIOS - Solo ADMIN
                // ============================================
                .requestMatchers("/api/users/**").hasRole("ADMIN")

                // ============================================
                // Cualquier otra ruta requiere autenticación
                // ============================================
                .anyRequest().authenticated()
            )

            // Gestión de sesiones: STATELESS (sin sesiones, solo JWT)
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // Proveedor de autenticación
            .authenticationProvider(authenticationProvider())

            // Agregar filtro JWT ANTES del filtro de autenticación estándar
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)

            // Configurar frames (para H2 Console)
            .headers(headers -> headers
                .frameOptions(frameOptions -> frameOptions.sameOrigin())
            );

        return http.build();
    }

    /**
     * Configuración de CORS
     * Permite requests desde el frontend
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Orígenes permitidos (frontend)
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:5173",    // Vite dev server
            "http://localhost:3000",    // Create React App
            "http://localhost:5174",    // Vite alternativo
            "http://localhost:8081"     // Otro posible puerto
        ));

        // Métodos HTTP permitidos
        configuration.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"
        ));

        // Headers permitidos
        configuration.setAllowedHeaders(Arrays.asList(
            "Authorization",
            "Content-Type",
            "Accept",
            "Origin",
            "X-Requested-With"
        ));

        // Permitir credenciales (cookies, auth headers)
        configuration.setAllowCredentials(true);

        // Headers expuestos al cliente
        configuration.setExposedHeaders(Arrays.asList(
            "Authorization",
            "Content-Type"
        ));

        // Max age para preflight requests
        configuration.setMaxAge(3600L);

        // Aplicar configuración a todas las rutas
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    /**
     * Proveedor de autenticación con BCrypt
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    /**
     * Encoder de contraseñas con BCrypt
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Authentication Manager
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}