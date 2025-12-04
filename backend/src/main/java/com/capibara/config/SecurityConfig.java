package com.capibara.config;

import com.capibara.security.CustomUserDetailsService;
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
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * Configuración de Spring Security
 *  Autenticación JWT con Roles
 *  Restricciones de acceso
 * 
 * Esta clase configura:
 * 1. Rutas públicas vs protegidas
 * 2. CORS para permitir peticiones desde el frontend
 * 3. JWT como método de autenticación
 * 4. Roles y permisos
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Deshabilitar CSRF (no necesario con JWT)
                .csrf(AbstractHttpConfigurer::disable)
                
                // Configurar CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                
                // Configurar autorización de peticiones
                .authorizeHttpRequests(auth -> auth
                        // ============================================
                        // RUTAS PÚBLICAS (sin autenticación)
                        // ============================================
                        
                        // Autenticación
                        .requestMatchers("/api/auth/**").permitAll()
                        
                        // Productos - Solo GET es público
                        .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                        
                        // Documentación
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**",
                                "/swagger-resources/**",
                                "/webjars/**"
                        ).permitAll()
                        
                        // H2 Console (solo para desarrollo)
                        .requestMatchers("/h2-console/**").permitAll()
                        
                        // Actuator (opcional)
                        .requestMatchers("/actuator/**").permitAll()
                        
                        // Página de error
                        .requestMatchers("/error").permitAll()
                        
                        // ============================================
                        // RUTAS PROTEGIDAS (requieren autenticación)
                        // ============================================
                        
                        // Productos - POST, PUT, DELETE solo para ADMIN
                        .requestMatchers(HttpMethod.POST, "/api/products/**").hasAuthority("ROLE_ADMIN")
.requestMatchers(HttpMethod.PUT, "/api/products/**").hasAuthority("ROLE_ADMIN")
.requestMatchers(HttpMethod.DELETE, "/api/products/**").hasAuthority("ROLE_ADMIN")
.requestMatchers(HttpMethod.PATCH, "/api/products/**").hasAuthority("ROLE_ADMIN")
.requestMatchers("/api/users/**").hasAuthority("ROLE_ADMIN")
.requestMatchers("/api/orders/**").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")
                        
                        // Usuarios - Solo ADMIN
                        .requestMatchers("/api/users/**").hasRole("ADMIN")
                        
                        // Órdenes - Usuarios autenticados
                        .requestMatchers("/api/orders/**").hasAnyRole("USER", "ADMIN")
                        
                        // Todas las demás rutas requieren autenticación
                        .anyRequest().authenticated()
                )
                
                // Configurar sesiones como STATELESS (sin estado, usa JWT)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                
                // Configurar proveedor de autenticación
                .authenticationProvider(authenticationProvider())
                
                // Agregar filtro JWT antes del filtro de autenticación estándar
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        // Permitir H2 Console en iframes (solo para desarrollo)
        http.headers(headers -> headers
                .frameOptions(frameOptions -> frameOptions.sameOrigin())
        );

        return http.build();
    }

    /**
     * Configuración de CORS
     * Permite peticiones desde el frontend (React en localhost:5173)
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Orígenes permitidos (tu frontend)
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:5173",      // Vite default
            "http://localhost:3000",      // Create React App default
            "http://localhost:5174",      // Vite alternativo
            "http://127.0.0.1:5173",
            "http://127.0.0.1:3000"
        ));
        
        // Métodos HTTP permitidos
        configuration.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"
        ));
        
        // Headers permitidos
        configuration.setAllowedHeaders(Arrays.asList("*"));
        
        // Permitir credenciales (cookies, authorization headers)
        configuration.setAllowCredentials(true);
        
        // Headers expuestos al cliente
        configuration.setExposedHeaders(Arrays.asList(
            "Authorization",
            "Content-Type",
            "Content-Disposition"
        ));
        
        // Tiempo de cache de la configuración CORS (1 hora)
        configuration.setMaxAge(3600L);
        
        // Aplicar configuración a todas las rutas
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }

    /**
     * Proveedor de autenticación que usa CustomUserDetailsService
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    /**
     * Authentication Manager para manejar la autenticación
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * Codificador de contraseñas BCrypt
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}