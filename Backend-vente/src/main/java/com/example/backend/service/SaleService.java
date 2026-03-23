// src/main/java/com/example/backend/service/SaleService.java
package com.example.backend.service;

import com.example.backend.dto.AuditStats;
import com.example.backend.dto.SaleRequest;
import com.example.backend.entity.*;
import com.example.backend.repository.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SaleService {
    
    private final SaleRepository saleRepository;
    private final ProductRepository productRepository;
    private final ClientRepository clientRepository;
    private final AuditSaleRepository auditSaleRepository;
    
    @Transactional
    public Sale createSale(SaleRequest request, String username, HttpServletRequest httpRequest) {
        Client client = clientRepository.findById(request.getClientId())
            .orElseThrow(() -> new RuntimeException("Client not found"));
        Product product = productRepository.findById(request.getProductId())
            .orElseThrow(() -> new RuntimeException("Product not found"));
        
        Sale sale = new Sale();
        sale.setClient(client);
        sale.setProduct(product);
        sale.setQuantity(request.getQuantity());
        
        Sale savedSale = saleRepository.save(sale);
        
        // Update stock
        product.setStock(product.getStock() - request.getQuantity());
        productRepository.save(product);
        
        // Create audit entry
        createAuditEntry("INSERT", client.getName(), product.getDesignation(), 
            null, request.getQuantity(), username, httpRequest);
        
        return savedSale;
    }
    
    @Transactional
    public Sale updateSale(Long id, SaleRequest request, String username, HttpServletRequest httpRequest) {
        Sale existingSale = saleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Sale not found"));
        
        Integer oldQuantity = existingSale.getQuantity();
        Product product = existingSale.getProduct();
        
        // Update stock: New stock = Old stock + oldQuantity - newQuantity
        int stockUpdate = oldQuantity - request.getQuantity();
        product.setStock(product.getStock() + stockUpdate);
        productRepository.save(product);
        
        // Update sale
        existingSale.setQuantity(request.getQuantity());
        Sale updatedSale = saleRepository.save(existingSale);
        
        // Create audit entry
        createAuditEntry("UPDATE", existingSale.getClient().getName(), 
            product.getDesignation(), oldQuantity, request.getQuantity(), 
            username, httpRequest);
        
        return updatedSale;
    }
    
    @Transactional
    public void deleteSale(Long id, String username, HttpServletRequest httpRequest) {
        Sale sale = saleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Sale not found"));
        
        Integer oldQuantity = sale.getQuantity();
        Product product = sale.getProduct();
        String clientName = sale.getClient().getName();
        String productDesignation = product.getDesignation();
        
        // Restore stock
        product.setStock(product.getStock() + oldQuantity);
        productRepository.save(product);
        
        // Create audit entry before deletion
        createAuditEntry("DELETE", clientName, productDesignation, 
            oldQuantity, null, username, httpRequest);
        
        saleRepository.delete(sale);
    }
    
    private void createAuditEntry(String operationType, String clientName, 
                                   String productDesignation, Integer oldQuantity, 
                                   Integer newQuantity, String username, 
                                   HttpServletRequest httpRequest) {
        AuditSale audit = new AuditSale();
        audit.setOperationType(operationType);
        audit.setUpdateDate(LocalDateTime.now());
        audit.setClientName(clientName);
        audit.setProductDesignation(productDesignation);
        audit.setOldQuantity(oldQuantity);
        audit.setNewQuantity(newQuantity);
        audit.setUsername(username);
        
        // Get host machine name
        try {
            String hostName = InetAddress.getLocalHost().getHostName();
            audit.setHostMachine(hostName);
        } catch (UnknownHostException e) {
            audit.setHostMachine("Unknown");
        }
        
        auditSaleRepository.save(audit);
    }
    
    public List<Sale> getAllSales() {
        return saleRepository.findAll();
    }
    
    public List<AuditSale> getAllAudits() {
        return auditSaleRepository.findAll();
    }
    
    public AuditStats getAuditStats() {
        return new AuditStats(
            auditSaleRepository.countInsertOperations(),
            auditSaleRepository.countUpdateOperations(),
            auditSaleRepository.countDeleteOperations()
        );
    }
    
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }
}