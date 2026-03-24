package com.example.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_sale")
public class AuditSale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "operation_type", nullable = false)
    private String operationType;
    
    @Column(name = "update_date", nullable = false)
    private LocalDateTime updateDate;
    
    @Column(name = "client_name", nullable = false)
    private String clientName;
    
    @Column(name = "product_designation", nullable = false)
    private String productDesignation;
    
    @Column(name = "old_quantity")
    private Integer oldQuantity;
    
    @Column(name = "new_quantity")
    private Integer newQuantity;
    
    @Column(name = "username", nullable = false)
    private String username;
    
    @Column(name = "host_machine", nullable = false)
    private String hostMachine;
    
    public AuditSale() {}
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getOperationType() { return operationType; }
    public void setOperationType(String operationType) { this.operationType = operationType; }
    
    public LocalDateTime getUpdateDate() { return updateDate; }
    public void setUpdateDate(LocalDateTime updateDate) { this.updateDate = updateDate; }
    
    public String getClientName() { return clientName; }
    public void setClientName(String clientName) { this.clientName = clientName; }
    
    public String getProductDesignation() { return productDesignation; }
    public void setProductDesignation(String productDesignation) { this.productDesignation = productDesignation; }
    
    public Integer getOldQuantity() { return oldQuantity; }
    public void setOldQuantity(Integer oldQuantity) { this.oldQuantity = oldQuantity; }
    
    public Integer getNewQuantity() { return newQuantity; }
    public void setNewQuantity(Integer newQuantity) { this.newQuantity = newQuantity; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getHostMachine() { return hostMachine; }
    public void setHostMachine(String hostMachine) { this.hostMachine = hostMachine; }
}