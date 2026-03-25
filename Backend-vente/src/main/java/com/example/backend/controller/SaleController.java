package com.example.backend.controller;

import com.example.backend.dto.*;
import com.example.backend.entity.*;
import com.example.backend.service.SaleService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class SaleController {

    private final SaleService saleService;

    // ==================== PRODUCT ENDPOINTS ====================
    
    @GetMapping("/products")
    public ResponseEntity<List<Product>> getProducts() {
        return ResponseEntity.ok(saleService.getAllProducts());
    }
    
    @GetMapping("/products/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(saleService.getProduct(id));
    }
    
    @PostMapping("/products")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> createProduct(@RequestBody ProductRequest request) {
        Product product = new Product();
        product.setDesignation(request.getDesignation());
        product.setStock(request.getStock());
        return ResponseEntity.ok(saleService.createProduct(product));
    }
    
    @PutMapping("/products/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, 
                                                   @RequestBody ProductRequest request) {
        return ResponseEntity.ok(saleService.updateProduct(id, request));
    }
    
    @DeleteMapping("/products/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        saleService.deleteProduct(id);
        return ResponseEntity.ok().build();
    }
    
    // ==================== CLIENT ENDPOINTS ====================
    
    @GetMapping("/clients")
    public ResponseEntity<List<Client>> getClients() {
        return ResponseEntity.ok(saleService.getAllClients());
    }
    
    @GetMapping("/clients/{id}")
    public ResponseEntity<Client> getClient(@PathVariable Long id) {
        return ResponseEntity.ok(saleService.getClient(id));
    }
    
    @PostMapping("/clients")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Client> createClient(@RequestBody ClientRequest request) {
        Client client = new Client();
        client.setName(request.getName());
        return ResponseEntity.ok(saleService.createClient(client));
    }
    
    @PutMapping("/clients/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Client> updateClient(@PathVariable Long id, 
                                                @RequestBody ClientRequest request) {
        return ResponseEntity.ok(saleService.updateClient(id, request));
    }
    
    @DeleteMapping("/clients/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id) {
        saleService.deleteClient(id);
        return ResponseEntity.ok().build();
    }
    
    // ==================== SALE ENDPOINTS ====================
    
    @GetMapping("/sales")
    public ResponseEntity<List<Sale>> getSales() {
        return ResponseEntity.ok(saleService.getAllSales());
    }
    
    @GetMapping("/sales/{id}")
    public ResponseEntity<Sale> getSale(@PathVariable Long id) {
        return ResponseEntity.ok(saleService.getSale(id));
    }
    
    @PostMapping("/sales")
    public ResponseEntity<Sale> createSale(@RequestBody SaleRequest request, 
                                           HttpServletRequest httpRequest) {
        String username = httpRequest.getHeader("X-Username");
        if (username == null || username.isEmpty()) {
            username = "system";
        }
        return ResponseEntity.ok(saleService.createSale(request, username, httpRequest));
    }
    
    @PutMapping("/sales/{id}")
    public ResponseEntity<Sale> updateSale(@PathVariable Long id, 
                                          @RequestBody SaleRequest request,
                                          HttpServletRequest httpRequest) {
        String username = httpRequest.getHeader("X-Username");
        if (username == null || username.isEmpty()) {
            username = "system";
        }
        return ResponseEntity.ok(saleService.updateSale(id, request, username, httpRequest));
    }
    
    @DeleteMapping("/sales/{id}")
    public ResponseEntity<Void> deleteSale(@PathVariable Long id, 
                                          HttpServletRequest httpRequest) {
        String username = httpRequest.getHeader("X-Username");
        if (username == null || username.isEmpty()) {
            username = "system";
        }
        saleService.deleteSale(id, username, httpRequest);
        return ResponseEntity.ok().build();
    }
    
    // ==================== AUDIT ENDPOINTS ====================
    
    @GetMapping("/audits")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AuditSale>> getAudits() {
        return ResponseEntity.ok(saleService.getAllAudits());
    }
    
    @GetMapping("/audits/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AuditStats> getAuditStats() {
        return ResponseEntity.ok(saleService.getAuditStats());
    }
}