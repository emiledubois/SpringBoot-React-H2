package com.capibara.models;

/**
 * Enum para el estado de las órdenes
 */
public enum OrderStatus {
    PENDING,      // Pendiente
    CONFIRMED,    // Confirmada
    PROCESSING,   // En proceso
    SHIPPED,      // Enviada
    DELIVERED,    // Entregada
    CANCELLED     // Cancelada
}
