
package com.stepvibe.repository;

import com.stepvibe.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repositorio para la entidad Product
 * Proporciona operaciones CRUD y queries personalizadas
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    /**
     * Busca productos por nombre (búsqueda parcial)
     */
    List<Product> findByNombreContainingIgnoreCase(String nombre);
    
    /**
     * Busca productos por descripción
     */
    List<Product> findByDescripcionContainingIgnoreCase(String descripcion);
    
    /**
     * Obtiene productos dentro de un rango de precio
     */
    List<Product> findByPrecioBetween(Double minPrice, Double maxPrice);
    
    /**
     * Obtiene todos los productos destacados
     */
    List<Product> findByDestacadoTrue();
    
    /**
     * Búsqueda combinada por nombre o descripción
     */
    @Query("SELECT p FROM Product p WHERE " +
           "LOWER(p.nombre) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.descripcion) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Product> buscarPorTexto(@Param("query") String query);
}
