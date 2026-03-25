export interface Audit {
    id: number;
    operationType: string; // 'INSERT', 'UPDATE', 'DELETE'
    updateDate: Date;
    clientName: string;
    productDesignation: string;
    oldQuantity: number | null;
    newQuantity: number | null;
    username: string;
    hostMachine: string;
}

export interface AuditStats {
    insertCount: number;
    updateCount: number;
    deleteCount: number;
}