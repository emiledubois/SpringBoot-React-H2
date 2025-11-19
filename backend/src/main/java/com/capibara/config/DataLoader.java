package com.capibara.config;

import com.capibara.models.Product;
import com.capibara.models.Role;
import com.capibara.models.User;
import com.capibara.repositories.ProductRepository;
import com.capibara.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

/**
 * Cargador de datos de prueba
 * IE3.1.1 - Datos de prueba para demostración
 */
@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        loadUsers();
        loadProducts();
    }

    private void loadUsers() {
        if (userRepository.count() == 0) {
            System.out.println("=== Cargando usuarios de prueba ===");

            // Usuario Admin
            User admin = new User();
            admin.setName("Administrador");
            admin.setEmail("admin@capibara.cl");
            admin.setPassword(passwordEncoder.encode("admin123"));
            Set<Role> adminRoles = new HashSet<>();
            adminRoles.add(Role.ROLE_ADMIN);
            adminRoles.add(Role.ROLE_USER);
            admin.setRoles(adminRoles);
            admin.setActive(true);
            userRepository.save(admin);

            // Usuario normal
            User user = new User();
            user.setName("Usuario Demo");
            user.setEmail("usuario@capibara.cl");
            user.setPassword(passwordEncoder.encode("usuario123"));
            Set<Role> userRoles = new HashSet<>();
            userRoles.add(Role.ROLE_USER);
            user.setRoles(userRoles);
            user.setActive(true);
            userRepository.save(user);

            System.out.println("✓ Usuarios creados exitosamente");
            System.out.println("  - admin@capibara.cl / admin123 (ADMIN)");
            System.out.println("  - usuario@capibara.cl / usuario123 (USER)");
        }
    }

    private void loadProducts() {
        if (productRepository.count() == 0) {
            System.out.println("=== Cargando productos de prueba ===");

            // Productos de ejemplo
            Product[] products = {
                    createProduct("Teclado RGB Mecánico", "Teclado mecánico gaming con iluminación RGB personalizable", new BigDecimal("89990"), 25, "Periféricos"),
                    createProduct("Mouse Gamer Pro", "Mouse óptico de alta precisión con 16000 DPI", new BigDecimal("45990"), 30, "Periféricos"),
                    createProduct("Monitor 27\" 144Hz", "Monitor gaming QHD con tasa de refresco de 144Hz", new BigDecimal("299990"), 15, "Monitores"),
                    createProduct("Audífonos Bluetooth", "Audífonos inalámbricos con cancelación de ruido", new BigDecimal("79990"), 40, "Audio"),
                    createProduct("Webcam Full HD", "Cámara web 1080p con micrófono integrado", new BigDecimal("35990"), 20, "Accesorios"),
                    createProduct("Alfombrilla Gaming XL", "Alfombrilla de mouse tamaño extra grande antideslizante", new BigDecimal("19990"), 50, "Accesorios"),
                    createProduct("Hub USB 3.0", "Hub USB 3.0 de 4 puertos con alimentación externa", new BigDecimal("15990"), 35, "Accesorios"),
                    createProduct("Silla Gaming Ergonómica", "Silla gaming con soporte lumbar y reposabrazos ajustables", new BigDecimal("189990"), 10, "Muebles"),
                    createProduct("Teclado Inalámbrico", "Teclado compacto inalámbrico para oficina", new BigDecimal("29990"), 45, "Periféricos"),
                    createProduct("Soporte Notebook", "Soporte ajustable de aluminio para laptop", new BigDecimal("24990"), 30, "Accesorios")
            };

            for (Product product : products) {
                productRepository.save(product);
            }

            System.out.println("✓ " + products.length + " productos creados exitosamente");
        }
    }

    private Product createProduct(String name, String description, BigDecimal price, Integer stock, String category) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setStock(stock);
        product.setCategory(category);
        product.setActive(true);
        product.setImageUrl("/img/default-product.png");
        return product;
    }
}
