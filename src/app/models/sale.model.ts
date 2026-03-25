import { Client } from './client.model';
import { Product } from './product.model';

export interface Sale {
    id: number;
    client: Client;
    product: Product;
    quantity: number;
}

export interface SaleRequest {
    clientId: number;
    productId: number;
    quantity: number;
}