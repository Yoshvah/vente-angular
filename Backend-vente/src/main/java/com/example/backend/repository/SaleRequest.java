// src/main/java/com/example/backend/dto/SaleRequest.java
package com.example.backend.dto;

import lombok.Data;

@Data
public class SaleRequest {
    private Long clientId;
    private Long productId;
    private Integer quantity;
}