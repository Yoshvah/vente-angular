// Fichier: BackendVenteApplication.java
package com.example.Backend_vente;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendVenteApplication {  // Changé de EmployeeApplication à BackendVenteApplication
    
    public static void main(String[] args) {
        SpringApplication.run(BackendVenteApplication.class, args);
    }
}