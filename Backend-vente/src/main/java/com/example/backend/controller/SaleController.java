// src/main/java/com/example/backend/controller/SaleController.java
package com.example.backend.controller;

import com.example.backend.dto.AuditStats;
import com.example.backend.dto.SaleRequest;
import com.example.backend.entity.*;
import com.example.backend.service.SaleService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class SaleController {
    
    private final SaleService saleService;
    
    @GetMapping("/products")
    public ResponseEntity<List<Product>> getProducts() {
        return ResponseEntity.ok(saleService.getAllProducts());
    }
    
    @GetMapping("/clients")
    public ResponseEntity<List<Client>> getClients() {
        return ResponseEntity.ok(saleService.getAllClients());
    }
    
    @GetMapping("/sales")
    public ResponseEntity<List<Sale>> getSales() {
        return ResponseEntity.ok(saleService.getAllSales());
    }
    
    @PostMapping("/sales")
    public ResponseEntity<Sale> createSale(@RequestBody SaleRequest request, 
                                           HttpServletRequest httpRequest) {
        String username = httpRequest.getHeader("X-Username");
        if (username == null) username = "admin";
        return ResponseEntity.ok(saleService.createSale(request, username, httpRequest));
    }
    
    @PutMapping("/sales/{id}")
    public ResponseEntity<Sale> updateSale(@PathVariable Long id, 
                                          @RequestBody SaleRequest request,
                                          HttpServletRequest httpRequest) {
        String username = httpRequest.getHeader("X-Username");
        if (username == null) username = "admin";
        return ResponseEntity.ok(saleService.updateSale(id, request, username, httpRequest));
    }
    
    @DeleteMapping("/sales/{id}")
    public ResponseEntity<Void> deleteSale(@PathVariable Long id, 
                                          HttpServletRequest httpRequest) {
        String username = httpRequest.getHeader("X-Username");
        if (username == null) username = "admin";
        saleService.deleteSale(id, username, httpRequest);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/audits")
    public ResponseEntity<List<AuditSale>> getAudits() {
        return ResponseEntity.ok(saleService.getAllAudits());
    }
    
    @GetMapping("/audits/stats")
    public ResponseEntity<AuditStats> getAuditStats() {
        return ResponseEntity.ok(saleService.getAuditStats());
    }
}