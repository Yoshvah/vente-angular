// src/main/java/com/example/backend/entity/Sale.java
package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "vente")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Sale {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "n_client", nullable = false)
    private Client client;
    
    @ManyToOne
    @JoinColumn(name = "n_produit", nullable = false)
    private Product product;
    
    @Column(name = "qtesortie", nullable = false)
    private Integer quantity;
}