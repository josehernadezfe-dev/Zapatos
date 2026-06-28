
package com.stepvibe.entity;
 
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
 
/**
 * Entidad que representa un producto (zapatilla) en la tienda
 */
@Entity
@Table(name = "productos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nombre;
    
    @Column(columnDefinition = "TEXT")
    private String descripcion;
    
    @Column(nullable = false)
    private Double precio;
    
    @Column(length = 500)
    private String imagen; // Ruta de la imagen o URL
    
    @Column(columnDefinition = "TEXT")
    private String tallas; // Separadas por comas: 36,37,38,39,40,41,42,43,44,45
    
    @Column(name = "destacado")
    private Boolean destacado = false;
    
    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;
    
    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;
    
    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
        fechaActualizacion = LocalDateTime.now();
        if (destacado == null) {
            destacado = false;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
    }
}
 
