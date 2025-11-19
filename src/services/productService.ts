import api from './api';

/**
 * Servicio de productos
 * IE3.2.2 - Integración Frontend-Backend
 */

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    imageUrl: string;
    active: boolean;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

const productService = {
    /**
     * Obtener todos los productos
     */
    getAllProducts: async (): Promise<Product[]> => {
        const response = await api.get<ApiResponse<Product[]>>('/products');
        return response.data.data;
    },

    /**
     * Obtener productos activos
     */
    getActiveProducts: async (): Promise<Product[]> => {
        const response = await api.get<ApiResponse<Product[]>>('/products/active');
        return response.data.data;
    },

    /**
     * Obtener productos disponibles (con stock)
     */
    getAvailableProducts: async (): Promise<Product[]> => {
        const response = await api.get<ApiResponse<Product[]>>('/products/available');
        return response.data.data;
    },

    /**
     * Obtener producto por ID
     */
    getProductById: async (id: number): Promise<Product> => {
        const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
        return response.data.data;
    },

    /**
     * Buscar productos por categoría
     */
    getProductsByCategory: async (category: string): Promise<Product[]> => {
        const response = await api.get<ApiResponse<Product[]>>(`/products/category/${category}`);
        return response.data.data;
    },

    /**
     * Buscar productos por nombre
     */
    searchProducts: async (name: string): Promise<Product[]> => {
        const response = await api.get<ApiResponse<Product[]>>(`/products/search`, {
            params: { name }
        });
        return response.data.data;
    },

    /**
     * Crear producto (Solo ADMIN)
     */
    createProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
        const response = await api.post<ApiResponse<Product>>('/products', product);
        return response.data.data;
    },

    /**
     * Actualizar producto (Solo ADMIN)
     */
    updateProduct: async (id: number, product: Partial<Product>): Promise<Product> => {
        const response = await api.put<ApiResponse<Product>>(`/products/${id}`, product);
        return response.data.data;
    },

    /**
     * Eliminar producto (Solo ADMIN)
     */
    deleteProduct: async (id: number): Promise<void> => {
        await api.delete(`/products/${id}`);
    },

    /**
     * Desactivar producto (Solo ADMIN)
     */
    deactivateProduct: async (id: number): Promise<void> => {
        await api.patch(`/products/${id}/deactivate`);
    },

    /**
     * Actualizar stock (Solo ADMIN)
     */
    updateStock: async (id: number, quantity: number): Promise<void> => {
        await api.patch(`/products/${id}/stock`, null, {
            params: { quantity }
        });
    }
};

export default productService;
