import api from './api';

interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface CreateOrderRequest {
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  notes?: string;
}

interface Order {
  id: number;
  userId: number;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  total: number;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const orderService = {
  /**
   * Crear orden
   * CRÍTICO: Requiere autenticación (token JWT)
   */
  createOrder: async (orderData: CreateOrderRequest): Promise<Order> => {
    console.log(' [orderService] Creando orden...');
    console.log(' [orderService] Items:', orderData.items.length);
    console.log(' [orderService] Token:', localStorage.getItem('token') ? 'SÍ' : 'NO');
    
    try {
      //  CORRECTO: /api/orders (requiere JWT)
      const response = await api.post<ApiResponse<Order>>('/api/orders', orderData);
      
      console.log(' [orderService] Orden creada:', response.data);
      
      return response.data.data;
      
    } catch (error: any) {
      console.error(' [orderService] Error del servidor:', error.response || error);
      
      if (error.response) {
        const status = error.response.status;
        
        if (status === 401) {
          throw new Error('Debes iniciar sesión para crear una orden');
        } else if (status === 403) {
          throw new Error('No tienes permisos para crear órdenes');
        } else if (status === 400) {
          throw new Error('Datos de orden inválidos');
        } else {
          throw new Error('Error al crear la orden');
        }
      } else {
        throw new Error('No se puede conectar con el servidor');
      }
    }
  },

  /**
   * Obtener órdenes del usuario actual
   */
  getMyOrders: async (): Promise<Order[]> => {
    console.log(' [orderService] Obteniendo mis órdenes...');
    
    try {
      //  CORRECTO: /api/orders/my (requiere JWT)
      const response = await api.get<ApiResponse<Order[]>>('/api/orders/my');
      
      console.log(' [orderService] Órdenes obtenidas:', response.data.data.length);
      
      return response.data.data;
      
    } catch (error: any) {
      console.error(' [orderService] Error obteniendo órdenes:', error);
      throw error;
    }
  },

  /**
   * Obtener una orden por ID
   */
  getOrderById: async (id: number): Promise<Order> => {
    console.log(' [orderService] Obteniendo orden:', id);
    
    try {
      //  CORRECTO: /api/orders/:id (requiere JWT)
      const response = await api.get<ApiResponse<Order>>(`/api/orders/${id}`);
      
      console.log(' [orderService] Orden obtenida:', response.data.data);
      
      return response.data.data;
      
    } catch (error: any) {
      console.error(' [orderService] Error obteniendo orden:', error);
      throw error;
    }
  },

  /**
   * Obtener todas las órdenes (solo ADMIN)
   */
  getAllOrders: async (): Promise<Order[]> => {
    console.log(' [orderService] Obteniendo todas las órdenes (ADMIN)...');
    
    try {
      //  CORRECTO: /api/orders (requiere JWT + ROLE_ADMIN)
      const response = await api.get<ApiResponse<Order[]>>('/api/orders');
      
      console.log(' [orderService] Órdenes obtenidas:', response.data.data.length);
      
      return response.data.data;
      
    } catch (error: any) {
      console.error(' [orderService] Error obteniendo órdenes:', error);
      throw error;
    }
  },

  /**
   * Actualizar estado de orden (solo ADMIN)
   */
  updateOrderStatus: async (id: number, status: string): Promise<Order> => {
    console.log(' [orderService] Actualizando estado de orden:', id, '→', status);
    
    try {
      //  CORRECTO: /api/orders/:id/status (requiere JWT + ROLE_ADMIN)
      const response = await api.put<ApiResponse<Order>>(`/api/orders/${id}/status`, { status });
      
      console.log(' [orderService] Estado actualizado:', response.data.data);
      
      return response.data.data;
      
    } catch (error: any) {
      console.error(' [orderService] Error actualizando estado:', error);
      throw error;
    }
  },

  /**
   * Cancelar orden
   */
  cancelOrder: async (id: number): Promise<Order> => {
    console.log(' [orderService] Cancelando orden:', id);
    
    try {
      //  CORRECTO: /api/orders/:id/cancel (requiere JWT)
      const response = await api.put<ApiResponse<Order>>(`/api/orders/${id}/cancel`);
      
      console.log(' [orderService] Orden cancelada:', response.data.data);
      
      return response.data.data;
      
    } catch (error: any) {
      console.error(' [orderService] Error cancelando orden:', error);
      throw error;
    }
  }
};

export default orderService;