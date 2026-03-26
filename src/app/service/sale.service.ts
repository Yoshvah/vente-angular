import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductRequest } from '../models/product.model';
import { Client, ClientRequest } from '../models/client.model';
import { Sale, SaleRequest } from '../models/sale.model';
import { Audit, AuditStats } from '../models/audit.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }


  // Product CRUD
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  createProduct(product: ProductRequest): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products`, product);
  }

  updateProduct(id: number, product: ProductRequest): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/products/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${id}`);
  }

  // Client CRUD
  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/clients`);
  }

  getClient(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/clients/${id}`);
  }

  createClient(client: ClientRequest): Observable<Client> {
    return this.http.post<Client>(`${this.apiUrl}/clients`, client);
  }

  updateClient(id: number, client: ClientRequest): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/clients/${id}`, client);
  }

  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/clients/${id}`);
  }

  // Sale CRUD with audit
  getSales(): Observable<Sale[]> {
    return this.http.get<Sale[]>(`${this.apiUrl}/sales`, { headers: this.getAuthHeaders() });
  }

  createSale(sale: SaleRequest, username: string): Observable<Sale> {
    const headers = new HttpHeaders().set('X-Username', username);
    return this.http.post<Sale>(`${this.apiUrl}/sales`, sale, { headers: this.getAuthHeaders() });
  }

  updateSale(id: number, sale: SaleRequest, username: string): Observable<Sale> {
    const headers = new HttpHeaders().set('X-Username', username);
    return this.http.put<Sale>(`${this.apiUrl}/sales/${id}`, sale, { headers: this.getAuthHeaders() });
  }

  deleteSale(id: number, username: string): Observable<void> {
    const headers = new HttpHeaders().set('X-Username', username);
    return this.http.delete<void>(`${this.apiUrl}/sales/${id}`, { headers: this.getAuthHeaders() });
  }

  // Audit
  getAudits(): Observable<Audit[]> {
    return this.http.get<Audit[]>(`${this.apiUrl}/audits`);
  }

  getAuditStats(): Observable<AuditStats> {
    return this.http.get<AuditStats>(`${this.apiUrl}/audits/stats`);
  }
}