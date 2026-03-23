// src/app/models/sale.model.ts
export interface Sale {
    id: number;
    client: Client;
    product: Product;
    quantity: number;
}