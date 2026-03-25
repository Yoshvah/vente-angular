package com.example.backend.service;

import com.example.backend.dto.*;
import com.example.backend.entity.*;
import com.example.backend.repository.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SaleService {

    private final ProductRepository productRepository;
    private final ClientRepository clientRepository;
    private final SaleRepository saleRepository;
    private final AuditSaleRepository auditSaleRepository;
    
    @PersistenceContext
    private EntityManager entityManager;

    // ==================== PRODUCT CRUD ====================
    
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    public Product getProduct(Long id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }
    
    public Product createProduct(Product product) {
        if (product.getStock() == null) {
            product.setStock(0);
        }
        return productRepository.save(product);
    }
    
    public Product updateProduct(Long id, ProductRequest request) {
        Product product = getProduct(id);
        product.setDesignation(request.getDesignation());
        product.setStock(request.getStock());
        return productRepository.save(product);
    }
    
    public void deleteProduct(Long id) {
        Product product = getProduct(id);
        // Check if product is used in any sales
        if (saleRepository.existsByProduct(product)) {
            throw new RuntimeException("Cannot delete product because it is referenced in sales");
        }
        productRepository.delete(product);
    }
    
    // ==================== CLIENT CRUD ====================
    
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }
    
    public Client getClient(Long id) {
        return clientRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Client not found with id: " + id));
    }
    
    public Client createClient(Client client) {
        return clientRepository.save(client);
    }
    
    public Client updateClient(Long id, ClientRequest request) {
        Client client = getClient(id);
        client.setName(request.getName());
        return clientRepository.save(client);
    }
    
    public void deleteClient(Long id) {
        Client client = getClient(id);
        // Check if client has any sales
        if (saleRepository.existsByClient(client)) {
            throw new RuntimeException("Cannot delete client because they have existing sales");
        }
        clientRepository.delete(client);
    }
    
    // ==================== SALE CRUD WITH AUDIT ====================
    
    public List<Sale> getAllSales() {
        return saleRepository.findAll();
    }
    
    public Sale getSale(Long id) {
        return saleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Sale not found with id: " + id));
    }
    
    public Sale createSale(SaleRequest request, String username, HttpServletRequest httpRequest) {
        // Set session variables for PostgreSQL triggers (if using triggers)
        setSessionVariables(username, httpRequest);
        
        // Validate and get entities
        Client client = getClient(request.getClientId());
        Product product = getProduct(request.getProductId());
        
        // Validate quantity
        if (request.getQuantity() <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }
        
        // Check stock availability
        if (product.getStock() < request.getQuantity()) {
            throw new RuntimeException("Insufficient stock! Available: " + product.getStock() + 
                                     ", Requested: " + request.getQuantity());
        }
        
        // Create sale
        Sale sale = new Sale();
        sale.setClient(client);
        sale.setProduct(product);
        sale.setQuantity(request.getQuantity());
        
        // Update product stock
        product.setStock(product.getStock() - request.getQuantity());
        productRepository.save(product);
        
        // Save sale
        Sale savedSale = saleRepository.save(sale);
        
        // Log audit (Java-based approach - use if not using database triggers)
        logAudit("INSERT", savedSale, null, username, httpRequest);
        
        return savedSale;
    }
    
    public Sale updateSale(Long id, SaleRequest request, String username, HttpServletRequest httpRequest) {
        // Set session variables for PostgreSQL triggers
        setSessionVariables(username, httpRequest);
        
        // Get existing sale
        Sale existingSale = getSale(id);
        Integer oldQuantity = existingSale.getQuantity();
        
        // Validate new quantity
        if (request.getQuantity() <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }
        
        // Get product
        Product product = existingSale.getProduct();
        
        // Calculate stock adjustment
        int quantityDifference = oldQuantity - request.getQuantity();
        
        // Check stock availability for increase
        if (quantityDifference < 0 && product.getStock() + quantityDifference < 0) {
            throw new RuntimeException("Insufficient stock! Available: " + product.getStock() + 
                                     ", Additional needed: " + Math.abs(quantityDifference));
        }
        
        // Update stock
        product.setStock(product.getStock() + quantityDifference);
        productRepository.save(product);
        
        // Update sale
        existingSale.setQuantity(request.getQuantity());
        Sale updatedSale = saleRepository.save(existingSale);
        
        // Log audit
        logAudit("UPDATE", updatedSale, oldQuantity, username, httpRequest);
        
        return updatedSale;
    }
    
    public void deleteSale(Long id, String username, HttpServletRequest httpRequest) {
        // Set session variables for PostgreSQL triggers
        setSessionVariables(username, httpRequest);
        
        // Get existing sale
        Sale sale = getSale(id);
        
        // Log audit before deletion
        logAudit("DELETE", sale, sale.getQuantity(), username, httpRequest);
        
        // Restore stock
        Product product = sale.getProduct();
        product.setStock(product.getStock() + sale.getQuantity());
        productRepository.save(product);
        
        // Delete sale
        saleRepository.delete(sale);
    }
    
    // ==================== AUDIT METHODS ====================
    
    public List<AuditSale> getAllAudits() {
        return auditSaleRepository.findAllByOrderByUpdateDateDesc();
    }
    
    public AuditStats getAuditStats() {
        Long insertCount = auditSaleRepository.countByOperationType("INSERT");
        Long updateCount = auditSaleRepository.countByOperationType("UPDATE");
        Long deleteCount = auditSaleRepository.countByOperationType("DELETE");
        
        return new AuditStats(insertCount, updateCount, deleteCount);
    }
    
    // ==================== HELPER METHODS ====================
    
    /**
     * Set PostgreSQL session variables for triggers
     * This allows triggers to access the current user and host machine
     */
    private void setSessionVariables(String username, HttpServletRequest request) {
        try {
            // Set current user
            if (username != null && !username.isEmpty()) {
                entityManager.createNativeQuery("SET myapp.current_user = :username")
                    .setParameter("username", username)
                    .executeUpdate();
            } else {
                entityManager.createNativeQuery("SET myapp.current_user = 'system'")
                    .executeUpdate();
            }
            
            // Set host machine
            String hostMachine = request != null ? request.getRemoteAddr() : "unknown";
            if (hostMachine == null || hostMachine.isEmpty()) {
                hostMachine = "unknown";
            }
            entityManager.createNativeQuery("SET myapp.host_machine = :host")
                .setParameter("host", hostMachine)
                .executeUpdate();
        } catch (Exception e) {
            // If PostgreSQL session variables are not supported, just log warning
            System.err.println("Could not set session variables: " + e.getMessage());
        }
    }
    
    /**
     * Log audit information (Java-based approach)
     * Use this if you're not using database triggers
     */
    private void logAudit(String operationType, Sale sale, Integer oldQuantity, 
                          String username, HttpServletRequest request) {
        try {
            AuditSale audit = new AuditSale();
            audit.setOperationType(operationType);
            audit.setUpdateDate(LocalDateTime.now());
            audit.setClientName(sale.getClient().getName());
            audit.setProductDesignation(sale.getProduct().getDesignation());
            audit.setOldQuantity(oldQuantity);
            audit.setNewQuantity(sale.getQuantity());
            audit.setUsername(username != null ? username : "system");
            
            // Get host machine
            String hostMachine = request != null ? request.getRemoteAddr() : "unknown";
            if (hostMachine == null || hostMachine.isEmpty()) {
                hostMachine = "unknown";
            }
            audit.setHostMachine(hostMachine);
            
            auditSaleRepository.save(audit);
        } catch (Exception e) {
            // Log error but don't fail the main operation
            System.err.println("Failed to save audit log: " + e.getMessage());
        }
    }
}