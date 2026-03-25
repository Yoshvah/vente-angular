package com.example.backend.repository;

import com.example.backend.entity.AuditSale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditSaleRepository extends JpaRepository<AuditSale, Long> {
    List<AuditSale> findAllByOrderByUpdateDateDesc();
    Long countByOperationType(String operationType);
}