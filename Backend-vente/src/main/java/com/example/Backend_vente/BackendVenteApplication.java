// Fichier: BackendEmployeeApplication.java
package com.example.Backend_Employee;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendEmployeeApplication {  // Changé de EmployeeApplication à BackendEmployeeApplication
    
    public static void main(String[] args) {
        SpringApplication.run(BackendEmployeeApplication.class, args);
    }
}