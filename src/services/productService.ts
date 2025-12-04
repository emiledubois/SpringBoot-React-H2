import axios from 'axios';
import { Product } from '../types';

const API_URL = 'http://localhost:8080/api/products';

/**
 * Servicio para manejar operaciones CRUD de productos
 * IE3.2.2 - Integración Backend-Frontend vía API REST
 */

/**
 * Obtener todos los productos (público - no requiere autenticación)
 */
const getAllProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get<Product[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    throw error;
  }
};

/**
 * Obtener un producto por ID (público)
 */
const getProductById = async (id: number): Promise<Product> => {
  try {
    const response = await axios.get<Product>(`${API_URL}/${id}`);
    return response.data;
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
    // El token JWT se agrega automáticamente por el interceptor de axios
    const response = await axios.post<Product>(API_URL, productData);
    return response.data;
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
    const response = await axios.put<Product>(`${API_URL}/${id}`, productData);
    return response.data;
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
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error(`Error eliminando producto ${id}:`, error);
    throw error;
  }
};

/**
 * Buscar productos por nombre o categoría (público)
 */
const searchProducts = async (searchTerm: string): Promise<Product[]> => {
  try {
    const response = await axios.get<Product[]>(`${API_URL}/search`, {
      params: { q: searchTerm }
    });
    return response.data;
  } catch (error) {
    console.error('Error buscando productos:', error);
    // Si el endpoint de búsqueda no existe, filtrar localmente
    const allProducts = await getAllProducts();
    return allProducts.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
};

/**
 * Obtener productos por categoría (público)
 */
const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const response = await axios.get<Product[]>(`${API_URL}/category/${category}`);
    return response.data;
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
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductsByCategory
};

export default productService;