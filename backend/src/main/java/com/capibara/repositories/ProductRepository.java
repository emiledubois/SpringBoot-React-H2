package com.capibara.repositories;

import com.capibara.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio para la entidad Product
 * IE3.1.1 - Implementar repositorios JPA
 * IE3.2.1 - API REST con operaciones CRUD
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    /**
     * Busca productos por categoría
     * @param category Categoría del producto
     * @return Lista de productos
     */
    List<Product> findByCategory(String category);

    /**
     * Busca productos activos
     * @param active Estado de activación
     * @return Lista de productos
     */
    List<Product> findByActive(Boolean active);

    /**
     * Busca productos por nombre (búsqueda parcial, case insensitive)
     * @param name Nombre a buscar
     * @return Lista de productos
     */
    List<Product> findByNameContainingIgnoreCase(String name);

    /**
     * Busca productos disponibles (activos y con stock)
     * @return Lista de productos disponibles
     */
    @Query("SELECT p FROM Product p WHERE p.active = true AND p.stock > 0")
    List<Product> findAvailableProducts();

    /**
     * Busca productos por categoría y que estén activos
     * @param category Categoría
     * @param active Estado de activación
     * @return Lista de productos
     */
    List<Product> findByCategoryAndActive(String category, Boolean active);
}
