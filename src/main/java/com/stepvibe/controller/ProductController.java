
package com.stepvibe.controller;

import com.stepvibe.dto.ProductDTO;
import com.stepvibe.service.FileStorageService;
import com.stepvibe.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controlador REST para operaciones CRUD de productos
 */
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:3000") // Ajustar según frontend
public class ProductController {
    
    private final ProductService productService;
    private final FileStorageService fileStorageService;
    
    /**
     * GET /api/products
     * Obtiene todos los productos
     */
    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        log.info("Solicitud GET a /api/products");
        List<ProductDTO> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }
    
    /**
     * GET /api/products/{id}
     * Obtiene un producto por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        log.info("Solicitud GET a /api/products/{}", id);
        ProductDTO product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }
    
    /**
     * GET /api/products/search
     * Busca productos por texto
     */
    @GetMapping("/search")
    public ResponseEntity<List<ProductDTO>> searchProducts(
            @RequestParam(name = "q") String query) {
        log.info("Búsqueda de productos: {}", query);
        List<ProductDTO> products = productService.searchProducts(query);
        return ResponseEntity.ok(products);
    }
    
    /**
     * GET /api/products/filter/price
     * Filtra productos por rango de precio
     */
    @GetMapping("/filter/price")
    public ResponseEntity<List<ProductDTO>> getProductsByPrice(
            @RequestParam Double minPrice,
            @RequestParam Double maxPrice) {
        log.info("Filtro de precio: {} - {}", minPrice, maxPrice);
        List<ProductDTO> products = productService.getProductsByPriceRange(minPrice, maxPrice);
        return ResponseEntity.ok(products);
    }
    
    /**
     * GET /api/products/featured
     * Obtiene los productos destacados
     */
    @GetMapping("/featured")
    public ResponseEntity<List<ProductDTO>> getFeaturedProducts() {
        log.info("Solicitud de productos destacados");
        List<ProductDTO> products = productService.getFeaturedProducts();
        return ResponseEntity.ok(products);
    }
    
    /**
     * POST /api/products
     * Crea un nuevo producto
     */
    @PostMapping
    public ResponseEntity<?> createProduct(
            @RequestParam String nombre,
            @RequestParam String descripcion,
            @RequestParam Double precio,
            @RequestParam String tallas,
            @RequestParam(required = false) Boolean destacado,
            @RequestParam(required = false) MultipartFile imagen) {
        
        try {
            log.info("Creando nuevo producto: {}", nombre);
            
            // Guardar imagen si viene
            String imagenPath = null;
            if (imagen != null && !imagen.isEmpty()) {
                imagenPath = fileStorageService.storeFile(imagen);
            }
            
            // Crear DTO con los datos
            ProductDTO productDTO = ProductDTO.builder()
                    .nombre(nombre)
                    .descripcion(descripcion)
                    .precio(precio)
                    .tallas(tallas)
                    .destacado(destacado != null ? destacado : false)
                    .build();
            
            ProductDTO createdProduct = productService.createProduct(productDTO, imagenPath);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Producto creado exitosamente");
            response.put("product", createdProduct);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            log.error("Error al crear producto: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    /**
     * PUT /api/products/{id}
     * Actualiza un producto existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductDTO productDTO) {
        
        try {
            log.info("Actualizando producto con ID: {}", id);
            ProductDTO updatedProduct = productService.updateProduct(id, productDTO);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Producto actualizado exitosamente");
            response.put("product", updatedProduct);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error al actualizar producto: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    /**
     * DELETE /api/products/{id}
     * Elimina un producto
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            log.info("Eliminando producto con ID: {}", id);
            productService.deleteProduct(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Producto eliminado exitosamente");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error al eliminar producto: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    /**
     * POST /api/products/upload-image
     * Endpoint para subir una imagen
     */
    @PostMapping("/upload-image")
    public ResponseEntity<?> uploadImage(@RequestParam MultipartFile file) {
        try {
            log.info("Subiendo imagen: {}", file.getOriginalFilename());
            String filePath = fileStorageService.storeFile(file);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Imagen subida exitosamente");
            response.put("path", filePath);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error al subir imagen: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
}
