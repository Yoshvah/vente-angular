package com.example.backend.dto;

public class ProductRequest {
    private String designation;
    private Integer stock;
    
    public ProductRequest() {}
    
    public ProductRequest(String designation, Integer stock) {
        this.designation = designation;
        this.stock = stock;
    }
    
    public String getDesignation() {
        return designation;
    }
    
    public void setDesignation(String designation) {
        this.designation = designation;
    }
    
    public Integer getStock() {
        return stock;
    }
    
    public void setStock(Integer stock) {
        this.stock = stock;
    }
}