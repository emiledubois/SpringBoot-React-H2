package com.capibara.repositories;

import com.capibara.models.Order;
import com.capibara.models.OrderStatus;
import com.capibara.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio para la entidad Order
 * IE3.1.1 - Implementar repositorios JPA
 * IE3.2.1 - API REST con operaciones CRUD
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    /**
     * Busca órdenes por usuario
     * @param user Usuario
     * @return Lista de órdenes
     */
    List<Order> findByUser(User user);

    /**
     * Busca órdenes por ID de usuario
     * @param userId ID del usuario
     * @return Lista de órdenes
     */
    List<Order> findByUserId(Long userId);

    /**
     * Busca órdenes por estado
     * @param status Estado de la orden
     * @return Lista de órdenes
     */
    List<Order> findByStatus(OrderStatus status);

    /**
     * Busca órdenes por usuario y estado
     * @param userId ID del usuario
     * @param status Estado de la orden
     * @return Lista de órdenes
     */
    List<Order> findByUserIdAndStatus(Long userId, OrderStatus status);

    /**
     * Obtiene todas las órdenes ordenadas por fecha de creación descendente
     * @return Lista de órdenes
     */
    @Query("SELECT o FROM Order o ORDER BY o.createdAt DESC")
    List<Order> findAllOrderByCreatedAtDesc();
}
