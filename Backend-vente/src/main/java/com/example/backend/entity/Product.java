// src/main/java/com/example/backend/entity/Product.java
package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "produit")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "n_produit")
    private Long id;
    
    @Column(name = "design", nullable = false)
    private String designation;
    
    @Column(name = "stock", nullable = false)
    private Integer stock;
}