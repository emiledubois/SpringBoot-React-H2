import api from './api';

// ========================
// INTERFACES
// ========================

export interface CreateOrderRequest {
  items: OrderItemRequest[];
  shippingAddress: string;
  notes?: string;
}

export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

export interface Order {
  id: number;
  userId: number;
  shippingAddress: string;
  notes: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  total: number;
  createdAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
  };
  quantity: number;
  price: number;
  subtotal: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ========================
// ORDER SERVICE
// ========================

const orderService = {
  /**
   * Crear una nueva orden
   * POST /api/orders
   * Requiere autenticación (JWT en header)
   */
  createOrder: async (request: CreateOrderRequest): Promise<Order> => {
    try {
      console.log(' orderService.createOrder llamado con:', request);
      
      // Verificar que hay items
      if (!request.items || request.items.length === 0) {
        throw new Error('La orden debe tener al menos un producto');
      }

      // Verificar que hay token
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación. Por favor inicia sesión.');
      }

      console.log(' Token encontrado:', token.substring(0, 20) + '...');
      console.log(' Enviando POST a /api/orders');

      // HACER EL REQUEST POST
      const response = await api.post<ApiResponse<Order>>('/api/orders', request);

      console.log(' Respuesta del servidor:', response);

      // Extraer data de la respuesta
      let order: Order;
      if (response.data && 'data' in response.data) {
        order = response.data.data;
      } else {
        order = response.data as any;
      }

      console.log(' Orden creada exitosamente:', order);
      return order;

    } catch (error: any) {
      console.error(' Error en orderService.createOrder:', error);

      // Errores específicos
      if (error.code === 'ERR_NETWORK') {
        throw new Error('No se pudo conectar al servidor. Verifica que el backend esté corriendo.');
      }

      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        console.error('Error del servidor:', {
          status,
          data,
          headers: error.response.headers
        });

        if (status === 401) {
          throw new Error('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
        } else if (status === 403) {
          throw new Error('No tienes permisos para crear órdenes.');
        } else if (status === 400) {
          throw new Error(data.message || 'Datos de la orden inválidos.');
        } else {
          throw new Error(data.message || 'Error al crear la orden');
        }
      }

      throw error;
    }
  },

  /**
   * Obtener todas las órdenes del usuario actual
   * GET /api/orders
   */
  getMyOrders: async (): Promise<Order[]> => {
    try {
      console.log(' Obteniendo mis órdenes...');
      const response = await api.get<ApiResponse<Order[]>>('/api/orders');

      let orders: Order[];
      if (response.data && 'data' in response.data) {
        orders = response.data.data;
      } else {
        orders = response.data as any;
      }

      console.log(' Órdenes obtenidas:', orders.length);
      return orders;

    } catch (error: any) {
      console.error(' Error al obtener órdenes:', error);

      if (error.response?.status === 401) {
        throw new Error('Debes iniciar sesión para ver tus órdenes');
      }

      throw new Error('Error al cargar las órdenes');
    }
  },

  /**
   * Obtener una orden por ID
   * GET /api/orders/{id}
   */
  getOrderById: async (orderId: number): Promise<Order> => {
    try {
      console.log(` Obteniendo orden ${orderId}...`);
      const response = await api.get<ApiResponse<Order>>(`/api/orders/${orderId}`);

      let order: Order;
      if (response.data && 'data' in response.data) {
        order = response.data.data;
      } else {
        order = response.data as any;
      }

      console.log(' Orden obtenida:', order);
      return order;

    } catch (error: any) {
      console.error(' Error al obtener orden:', error);

      if (error.response?.status === 404) {
        throw new Error('Orden no encontrada');
      } else if (error.response?.status === 401) {
        throw new Error('Debes iniciar sesión');
      }

      throw new Error('Error al cargar la orden');
    }
  },

  /**
   * Cancelar una orden
   * PUT /api/orders/{id}/cancel
   */
  cancelOrder: async (orderId: number): Promise<Order> => {
    try {
      console.log(` Cancelando orden ${orderId}...`);
      const response = await api.put<ApiResponse<Order>>(`/api/orders/${orderId}/cancel`);

      let order: Order;
      if (response.data && 'data' in response.data) {
        order = response.data.data;
      } else {
        order = response.data as any;
      }

      console.log(' Orden cancelada:', order);
      return order;

    } catch (error: any) {
      console.error(' Error al cancelar orden:', error);

      if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || 'No se puede cancelar esta orden');
      }

      throw new Error('Error al cancelar la orden');
    }
  }
};

export default orderService;