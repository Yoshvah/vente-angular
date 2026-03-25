package com.example.backend.dto;

public class SaleRequest {
    private Long clientId;
    private Long productId;
    private Integer quantity;
    
    public SaleRequest() {}
    
    public SaleRequest(Long clientId, Long productId, Integer quantity) {
        this.clientId = clientId;
        this.productId = productId;
        this.quantity = quantity;
    }
    
    public Long getClientId() {
        return clientId;
    }
    
    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }
    
    public Long getProductId() {
        return productId;
    }
    
    public void setProductId(Long productId) {
        this.productId = productId;
    }
    
    public Integer getQuantity() {
        return quantity;
    }
    
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}