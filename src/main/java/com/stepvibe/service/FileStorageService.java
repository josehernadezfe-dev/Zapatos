
package com.stepvibe.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

/**
 * Servicio para manejo de almacenamiento de archivos (imágenes)
 */
@Service
@Slf4j
public class FileStorageService {
    
    @Value("${file.upload-dir:uploads/images}")
    private String uploadDir;
    
    /**
     * Guarda un archivo subido y retorna su ruta
     */
    public String storeFile(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("El archivo está vacío");
            }
            
            // Validar tipo de archivo
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new RuntimeException("Solo se permiten archivos de imagen");
            }
            
            // Crear directorio si no existe
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            // Generar nombre único para el archivo
            String fileName = UUID.randomUUID().toString() + "-" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            
            // Guardar archivo
            Files.copy(file.getInputStream(), filePath);
            
            log.info("Archivo guardado exitosamente: {}", fileName);
            
            // Retornar ruta relativa
            return uploadDir + "/" + fileName;
            
        } catch (IOException e) {
            log.error("Error al guardar archivo: {}", e.getMessage());
            throw new RuntimeException("Error al guardar archivo: " + e.getMessage());
        }
    }
    
    /**
     * Elimina un archivo
     */
    public void deleteFile(String filePath) {
        try {
            Path path = Paths.get(filePath);
            Files.deleteIfExists(path);
            log.info("Archivo eliminado: {}", filePath);
        } catch (IOException e) {
            log.error("Error al eliminar archivo: {}", e.getMessage());
        }
    }
}
