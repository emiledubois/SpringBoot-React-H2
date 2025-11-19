package com.capibara;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Aplicación principal de Capibara Backend
 *
 * @author DSY1104 - Evaluación Parcial 3
 * @version 1.0.0
 */
@SpringBootApplication
public class CapibaraApplication {

    public static void main(String[] args) {
        SpringApplication.run(CapibaraApplication.class, args);
        System.out.println("\n========================================");
        System.out.println("✓ Capibara Backend iniciado exitosamente");
        System.out.println("✓ Swagger UI: http://localhost:8080/swagger-ui.html");
        System.out.println("✓ API Docs: http://localhost:8080/v3/api-docs");
        System.out.println("========================================\n");
    }
}
