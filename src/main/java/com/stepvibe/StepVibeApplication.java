package com.stepvibe;
 
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
 
@SpringBootApplication
@EnableWebMvc
public class StepVibeApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(StepVibeApplication.class, args);
    }
}
