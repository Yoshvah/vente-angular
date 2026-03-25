package com.example.backend.repository;

import com.example.backend.entity.Client;
import com.example.backend.entity.Product;
import com.example.backend.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {
    List<Sale> findByClient(Client client);
    List<Sale> findByProduct(Product product);
    boolean existsByClient(Client client);
    boolean existsByProduct(Product product);
}