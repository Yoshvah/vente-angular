package com.example.backend.dto;

public class AuditStats {
    private Long insertCount;
    private Long updateCount;
    private Long deleteCount;
    
    public AuditStats() {}
    
    public AuditStats(Long insertCount, Long updateCount, Long deleteCount) {
        this.insertCount = insertCount;
        this.updateCount = updateCount;
        this.deleteCount = deleteCount;
    }
    
    public Long getInsertCount() { return insertCount; }
    public void setInsertCount(Long insertCount) { this.insertCount = insertCount; }
    
    public Long getUpdateCount() { return updateCount; }
    public void setUpdateCount(Long updateCount) { this.updateCount = updateCount; }
    
    public Long getDeleteCount() { return deleteCount; }
    public void setDeleteCount(Long deleteCount) { this.deleteCount = deleteCount; }
}