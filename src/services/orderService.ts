import api from './api';

/**
 * Servicio de órdenes
 * IE3.2.2 - Integración Frontend-Backend
 */

export interface OrderItem {
    productId: number;
    quantity: number;
}

export interface CreateOrderRequest {
    items: OrderItem[];
    shippingAddress?: string;
    notes?: string;
}

export interface Order {
    id: number;
    user: any;
    items: any[];
    total: number;
    status: string;
    shippingAddress?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

const orderService = {
    /**
     * Obtener todas las órdenes (Solo ADMIN)
     */
    getAllOrders: async (): Promise<Order[]> => {
        const response = await api.get<ApiResponse<Order[]>>('/orders');
        return response.data.data;
    },

    /**
     * Obtener mis órdenes
     */
    getMyOrders: async (): Promise<Order[]> => {
        const response = await api.get<ApiResponse<Order[]>>('/orders/my-orders');
        return response.data.data;
    },

    /**
     * Obtener orden por ID
     */
    getOrderById: async (id: number): Promise<Order> => {
        const response = await api.get<ApiResponse<Order>>(`/orders/${id}`);
        return response.data.data;
    },

    /**
     * Crear nueva orden
     */
    createOrder: async (orderData: CreateOrderRequest): Promise<Order> => {
        const response = await api.post<ApiResponse<Order>>('/orders', orderData);
        return response.data.data;
    },

    /**
     * Actualizar estado de orden (Solo ADMIN)
     */
    updateOrderStatus: async (id: number, status: string): Promise<Order> => {
        const response = await api.patch<ApiResponse<Order>>(`/orders/${id}/status`, null, {
            params: { status }
        });
        return response.data.data;
    },

    /**
     * Cancelar orden
     */
    cancelOrder: async (id: number): Promise<void> => {
        await api.patch(`/orders/${id}/cancel`);
    },

    /**
     * Eliminar orden (Solo ADMIN)
     */
    deleteOrder: async (id: number): Promise<void> => {
        await api.delete(`/orders/${id}`);
    }
};

export default orderService;
