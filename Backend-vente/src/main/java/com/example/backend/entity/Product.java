package com.example.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "produit")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "n_produit")
    private Long id;
    
    @Column(name = "design", nullable = false)
    private String designation;
    
    @Column(name = "stock", nullable = false)
    private Integer stock;
    
    public Product() {}
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }
    
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
}