import api from './api';
import { Product } from '../types';

/**
 * Servicio para manejar operaciones CRUD de productos
 * IE3.2.2 - Integración Backend-Frontend vía API REST
 */

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Obtener todos los productos (público - no requiere autenticación)
 */
const getAllProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get<ApiResponse<Product[]>>('/products');
    
    // Si la respuesta tiene estructura ApiResponse, extraer data
    if (response.data && 'data' in response.data) {
      return response.data.data;
    }
    
    // Si es un array directo, retornarlo
    return response.data as any;
  } catch (error: any) {
    console.error('Error obteniendo productos:', error);
    
    // Si el error es de CORS o network, dar mensaje específico
    if (error.code === 'ERR_NETWORK') {
      throw new Error('No se puede conectar al servidor. Verifica que el backend esté corriendo en http://localhost:8080');
    }
    
    throw error;
  }
};

/**
 * Obtener productos activos con stock (público)
 */
const getAvailableProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get<ApiResponse<Product[]>>('/products/available');
    
    if (response.data && 'data' in response.data) {
      return response.data.data;
    }
    
    return response.data as any;
  } catch (error) {
    console.error('Error obteniendo productos disponibles:', error);
    // Fallback: intentar obtener todos los productos
    return getAllProducts();
  }
};

/**
 * Obtener un producto por ID (público)
 */
const getProductById = async (id: number): Promise<Product> => {
  try {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
    
    if (response.data && 'data' in response.data) {
      return response.data.data;
    }
    
    return response.data as any;
  } catch (error) {
    console.error(`Error obteniendo producto ${id}:`, error);
    throw error;
  }
};

/**
 * Crear un nuevo producto (requiere autenticación ADMIN)
 */
const createProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
  try {
    const response = await api.post<ApiResponse<Product>>('/products', productData);
    
    if (response.data && 'data' in response.data) {
      return response.data.data;
    }
    
    return response.data as any;
  } catch (error) {
    console.error('Error creando producto:', error);
    throw error;
  }
};

/**
 * Actualizar un producto existente (requiere autenticación ADMIN)
 */
const updateProduct = async (id: number, productData: Omit<Product, 'id'>): Promise<Product> => {
  try {
    const response = await api.put<ApiResponse<Product>>(`/products/${id}`, productData);
    
    if (response.data && 'data' in response.data) {
      return response.data.data;
    }
    
    return response.data as any;
  } catch (error) {
    console.error(`Error actualizando producto ${id}:`, error);
    throw error;
  }
};

/**
 * Eliminar un producto (requiere autenticación ADMIN)
 */
const deleteProduct = async (id: number): Promise<void> => {
  try {
    await api.delete(`/products/${id}`);
  } catch (error) {
    console.error(`Error eliminando producto ${id}:`, error);
    throw error;
  }
};

/**
 * Buscar productos por nombre (público)
 */
const searchProducts = async (searchTerm: string): Promise<Product[]> => {
  try {
    const response = await api.get<ApiResponse<Product[]>>('/products/search', {
      params: { name: searchTerm }
    });
    
    if (response.data && 'data' in response.data) {
      return response.data.data;
    }
    
    return response.data as any;
  } catch (error) {
    console.error('Error buscando productos:', error);
    // Fallback: filtrar localmente
    const allProducts = await getAllProducts();
    return allProducts.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
};

/**
 * Obtener productos por categoría (público)
 */
const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const response = await api.get<ApiResponse<Product[]>>(`/products/category/${category}`);
    
    if (response.data && 'data' in response.data) {
      return response.data.data;
    }
    
    return response.data as any;
  } catch (error) {
    console.error('Error obteniendo productos por categoría:', error);
    // Fallback: filtrar localmente
    const allProducts = await getAllProducts();
    return allProducts.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  }
};

const productService = {
  getAllProducts,
  getAvailableProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductsByCategory
};

export default productService;