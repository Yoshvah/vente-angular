export interface Product {
    id: number;
    designation: string;
    stock: number;
}

export interface ProductRequest {
    designation: string;
    stock: number;
}