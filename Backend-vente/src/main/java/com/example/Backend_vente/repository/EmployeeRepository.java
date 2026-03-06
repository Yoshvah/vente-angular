package com.example.Backend_vente.repository;

import com.example.Backend_vente.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    
    @Query("SELECT SUM(e.salaire) FROM Employee e")
    Double getTotalSalary();
    
    @Query("SELECT MIN(e.salaire) FROM Employee e")
    Double getMinSalary();
    
    @Query("SELECT MAX(e.salaire) FROM Employee e")
    Double getMaxSalary();
}