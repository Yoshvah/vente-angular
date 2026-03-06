// src/main/java/com/example/employee/model/Employee.java
package com.example.employee.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "employees")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employee {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long numEmp;
    
    @Column(nullable = false)
    private String nom;
    
    @Column(nullable = false)
    private Double salaire;
}