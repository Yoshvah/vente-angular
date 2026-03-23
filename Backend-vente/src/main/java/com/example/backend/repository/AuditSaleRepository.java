// src/main/java/com/example/backend/repository/AuditSaleRepository.java
package com.example.backend.repository;

import com.example.backend.entity.AuditSale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditSaleRepository extends JpaRepository<AuditSale, Long> {
    
    @Query("SELECT COUNT(a) FROM AuditSale a WHERE a.operationType = 'INSERT'")
    Long countInsertOperations();
    
    @Query("SELECT COUNT(a) FROM AuditSale a WHERE a.operationType = 'UPDATE'")
    Long countUpdateOperations();
    
    @Query("SELECT COUNT(a) FROM AuditSale a WHERE a.operationType = 'DELETE'")
    Long countDeleteOperations();
}