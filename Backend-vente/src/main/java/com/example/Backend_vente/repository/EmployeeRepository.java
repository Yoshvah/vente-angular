// src/main/java/com/example/employee/repository/EmployeeRepository.java
package com.example.employee.repository;

import com.example.employee.model.Employee;
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