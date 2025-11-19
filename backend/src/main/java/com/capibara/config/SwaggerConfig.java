package com.capibara.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuración de Swagger/OpenAPI
 * IE3.2.1 - Integración de Swagger para documentación de API
 */
@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI capibaraOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Capibara API - Tienda Online")
                        .description("API REST completa para la tienda online Capibara - DSY1104 Evaluación Parcial 3")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Equipo Capibara")
                                .email("contacto@capibara.cl"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT"))
                )
                .components(new Components()
                        .addSecuritySchemes("bearerAuth",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Ingrese el token JWT (obtenido en /api/auth/login)")
                        )
                );
    }
}
