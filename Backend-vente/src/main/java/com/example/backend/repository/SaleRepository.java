// src/main/java/com/example/backend/repository/SaleRepository.java
package com.example.backend.repository;

import com.example.backend.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {
}