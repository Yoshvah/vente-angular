// src/app/models/audit.model.ts
export interface Audit {
    id: number;
    operationType: string;
    updateDate: Date;
    clientName: string;
    productDesignation: string;
    oldQuantity: number;
    newQuantity: number;
    username: string;
    hostMachine: string;
}