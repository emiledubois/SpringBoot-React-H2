package com.capibara.repositories;

import com.capibara.models.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio para la entidad OrderItem
 * IE3.1.1 - Implementar repositorios JPA
 */
@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    /**
     * Busca items por ID de orden
     * @param orderId ID de la orden
     * @return Lista de items
     */
    List<OrderItem> findByOrderId(Long orderId);

    /**
     * Busca items por ID de producto
     * @param productId ID del producto
     * @return Lista de items
     */
    List<OrderItem> findByProductId(Long productId);
}
