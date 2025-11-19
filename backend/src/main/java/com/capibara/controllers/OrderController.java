package com.capibara.controllers;

import com.capibara.dto.ApiResponse;
import com.capibara.dto.CreateOrderRequest;
import com.capibara.models.Order;
import com.capibara.models.OrderStatus;
import com.capibara.models.User;
import com.capibara.repositories.UserRepository;
import com.capibara.services.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para órdenes
 * IE3.2.1 - API REST CRUD completo con Swagger
 * IE3.3.3 - Restricciones de acceso por roles
 */
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Órdenes", description = "Endpoints para gestión de órdenes/pedidos")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Listar todas las órdenes", description = "Obtiene todas las órdenes (Solo ADMIN)")
    public ResponseEntity<ApiResponse<List<Order>>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @GetMapping("/my-orders")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @Operation(summary = "Mis órdenes", description = "Obtiene las órdenes del usuario autenticado")
    public ResponseEntity<ApiResponse<List<Order>>> getMyOrders(Authentication authentication) {
        try {
            User user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            List<Order> orders = orderService.getOrdersByUserId(user.getId());
            return ResponseEntity.ok(ApiResponse.success(orders));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @Operation(summary = "Obtener orden por ID", description = "Obtiene una orden específica")
    public ResponseEntity<ApiResponse<Order>> getOrderById(
            @PathVariable Long id,
            Authentication authentication
    ) {
        try {
            Order order = orderService.getOrderById(id);

            // Verificar permisos: solo el dueño o admin puede ver la orden
            User user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            if (!order.getUser().getId().equals(user.getId()) && !user.isAdmin()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(ApiResponse.error("No tienes permiso para ver esta orden"));
            }

            return ResponseEntity.ok(ApiResponse.success(order));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Buscar por estado", description = "Obtiene órdenes por estado (Solo ADMIN)")
    public ResponseEntity<ApiResponse<List<Order>>> getOrdersByStatus(@PathVariable OrderStatus status) {
        List<Order> orders = orderService.getOrdersByStatus(status);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @Operation(summary = "Crear orden", description = "Crea una nueva orden de compra")
    public ResponseEntity<ApiResponse<Order>> createOrder(
            @Valid @RequestBody CreateOrderRequest request,
            Authentication authentication
    ) {
        try {
            User user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            Order order = orderService.createOrder(user.getId(), request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Orden creada exitosamente", order));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Actualizar estado", description = "Actualiza el estado de una orden (Solo ADMIN)")
    public ResponseEntity<ApiResponse<Order>> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status
    ) {
        try {
            Order order = orderService.updateOrderStatus(id, status);
            return ResponseEntity.ok(ApiResponse.success("Estado actualizado exitosamente", order));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @Operation(summary = "Cancelar orden", description = "Cancela una orden")
    public ResponseEntity<ApiResponse<Void>> cancelOrder(
            @PathVariable Long id,
            Authentication authentication
    ) {
        try {
            Order order = orderService.getOrderById(id);

            // Verificar permisos
            User user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            if (!order.getUser().getId().equals(user.getId()) && !user.isAdmin()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(ApiResponse.error("No tienes permiso para cancelar esta orden"));
            }

            orderService.cancelOrder(id);
            return ResponseEntity.ok(ApiResponse.success("Orden cancelada exitosamente", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Eliminar orden", description = "Elimina una orden (Solo ADMIN)")
    public ResponseEntity<ApiResponse<Void>> deleteOrder(@PathVariable Long id) {
        try {
            orderService.deleteOrder(id);
            return ResponseEntity.ok(ApiResponse.success("Orden eliminada exitosamente", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}
