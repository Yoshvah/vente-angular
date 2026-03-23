// src/main/java/com/example/backend/dto/AuditStats.java
package com.example.backend.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuditStats {
    private Long insertCount;
    private Long updateCount;
    private Long deleteCount;
}