
package com.stepvibe.service;

import com.stepvibe.dto.ProductDTO;
import com.stepvibe.entity.Product;
import com.stepvibe.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio para la lógica de negocio de productos
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class ProductService {
    
    private final ProductRepository productRepository;
    private final FileStorageService fileStorageService;
    
    /**
     * Obtiene todos los productos
     */
    public List<ProductDTO> getAllProducts() {
        log.info("Obteniendo todos los productos");
        return productRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Obtiene un producto por ID
     */
    public ProductDTO getProductById(Long id) {
        log.info("Obteniendo producto con ID: {}", id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
        return convertToDTO(product);
    }
    
    /**
     * Crea un nuevo producto
     */
    public ProductDTO createProduct(ProductDTO productDTO, String imagenPath) {
        log.info("Creando nuevo producto: {}", productDTO.getNombre());
        
        Product product = Product.builder()
                .nombre(productDTO.getNombre())
                .descripcion(productDTO.getDescripcion())
                .precio(productDTO.getPrecio())
                .imagen(imagenPath)
                .tallas(productDTO.getTallas())
                .destacado(productDTO.getDestacado() != null ? productDTO.getDestacado() : false)
                .build();
        
        Product savedProduct = productRepository.save(product);
        log.info("Producto creado exitosamente con ID: {}", savedProduct.getId());
        
        return convertToDTO(savedProduct);
    }
    
    /**
     * Actualiza un producto existente
     */
    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        log.info("Actualizando producto con ID: {}", id);
        
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
        
        product.setNombre(productDTO.getNombre());
        product.setDescripcion(productDTO.getDescripcion());
        product.setPrecio(productDTO.getPrecio());
        product.setTallas(productDTO.getTallas());
        product.setDestacado(productDTO.getDestacado());
        
        Product updatedProduct = productRepository.save(product);
        log.info("Producto actualizado exitosamente");
        
        return convertToDTO(updatedProduct);
    }
    
    /**
     * Elimina un producto
     */
    public void deleteProduct(Long id) {
        log.info("Eliminando producto con ID: {}", id);
        
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
        
        // Eliminar imagen si existe
        if (product.getImagen() != null) {
            fileStorageService.deleteFile(product.getImagen());
        }
        
        productRepository.deleteById(id);
        log.info("Producto eliminado exitosamente");
    }
    
    /**
     * Busca productos por texto
     */
    public List<ProductDTO> searchProducts(String query) {
        log.info("Buscando productos con query: {}", query);
        return productRepository.buscarPorTexto(query)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Obtiene productos dentro de un rango de precio
     */
    public List<ProductDTO> getProductsByPriceRange(Double minPrice, Double maxPrice) {
        log.info("Buscando productos entre ${} y ${}", minPrice, maxPrice);
        return productRepository.findByPrecioBetween(minPrice, maxPrice)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Obtiene los productos destacados
     */
    public List<ProductDTO> getFeaturedProducts() {
        log.info("Obteniendo productos destacados");
        return productRepository.findByDestacadoTrue()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Convierte una entidad Product a DTO
     */
    private ProductDTO convertToDTO(Product product) {
        return ProductDTO.builder()
                .id(product.getId())
                .nombre(product.getNombre())
                .descripcion(product.getDescripcion())
                .precio(product.getPrecio())
                .imagen(product.getImagen())
                .tallas(product.getTallas())
                .destacado(product.getDestacado())
                .fechaCreacion(product.getFechaCreacion())
                .fechaActualizacion(product.getFechaActualizacion())
                .build();
    }
}
