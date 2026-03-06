// src/main/java/com/example/employee/dto/EmployeeDTO.java
package com.example.employee.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDTO {
    private Long numEmp;
    private String nom;
    private Double salaire;
    private String obs;
    
    public EmployeeDTO(Long numEmp, String nom, Double salaire) {
        this.numEmp = numEmp;
        this.nom = nom;
        this.salaire = salaire;
        this.obs = determineObservation(salaire);
    }
    
    private String determineObservation(Double salaire) {
        if (salaire < 1000) return "médiocre";
        else if (salaire >= 1000 && salaire <= 5000) return "moyen";
        else return "grand";
    }
}