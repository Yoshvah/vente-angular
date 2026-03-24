import { Client } from './client.model';
import { Product } from './product.model';

export interface Sale {
    id: number;
    client: Client;
    product: Product;
    quantity: number;
}