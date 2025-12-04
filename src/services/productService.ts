import api from './api';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  available: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const productService = {
  /**
   * Obtener todos los productos
   * CRÍTICO: La ruta debe ser /api/products (con /api/)
   */
  getAllProducts: async (): Promise<Product[]> => {
    console.log(' Obteniendo productos...');
    
    try {
      //  CORRECTO: /api/products
      const response = await api.get<ApiResponse<Product[]>>('/api/products');
      
      console.log(' Productos obtenidos:', response.data.data.length);
      
      return response.data.data;
      
    } catch (error: any) {
      console.error(' Error obteniendo productos:', error);
      throw error;
    }
  },

  /**
   * Obtener un producto por ID
   */
  getProductById: async (id: number): Promise<Product> => {
    console.log(' Obteniendo producto:', id);
    
    try {
      //  CORRECTO: /api/products/:id
      const response = await api.get<ApiResponse<Product>>(`/api/products/${id}`);
      
      console.log(' Producto obtenido:', response.data.data);
      
      return response.data.data;
      
    } catch (error: any) {
      console.error(' Error obteniendo producto:', error);
      throw error;
    }
  },

  /**
   * Crear producto (requiere ADMIN)
   */
  createProduct: async (productData: Partial<Product>): Promise<Product> => {
    console.log(' Creando producto:', productData.name);
    
    try {
      //  CORRECTO: /api/products (requiere JWT)
      const response = await api.post<ApiResponse<Product>>('/api/products', productData);
      
      console.log(' Producto creado:', response.data.data);
      
      return response.data.data;
      
    } catch (error: any) {
      console.error(' Error creando producto:', error);
      throw error;
    }
  },

  /**
   * Actualizar producto (requiere ADMIN)
   */
  updateProduct: async (id: number, productData: Partial<Product>): Promise<Product> => {
    console.log(' Actualizando producto:', id);
    
    try {
      //  CORRECTO: /api/products/:id (requiere JWT)
      const response = await api.put<ApiResponse<Product>>(`/api/products/${id}`, productData);
      
      console.log(' Producto actualizado:', response.data.data);
      
      return response.data.data;
      
    } catch (error: any) {
      console.error(' Error actualizando producto:', error);
      throw error;
    }
  },

  /**
   * Eliminar producto (requiere ADMIN)
   */
  deleteProduct: async (id: number): Promise<void> => {
    console.log(' Eliminando producto:', id);
    
    try {
      //  CORRECTO: /api/products/:id (requiere JWT)
      await api.delete(`/api/products/${id}`);
      
      console.log(' Producto eliminado');
      
    } catch (error: any) {
      console.error(' Error eliminando producto:', error);
      throw error;
    }
  }
};

export default productService;