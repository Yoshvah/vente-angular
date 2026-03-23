// src/app/services/sale.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { Client } from '../models/client.model';
import { Sale } from '../models/sale.model';
import { Audit } from '../models/audit.model';
import { AuditStats } from '../models/audit-stats.model';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/clients`);
  }

  getSales(): Observable<Sale[]> {
    return this.http.get<Sale[]>(`${this.apiUrl}/sales`);
  }

  createSale(sale: any, username: string): Observable<Sale> {
    const headers = new HttpHeaders().set('X-Username', username);
    return this.http.post<Sale>(`${this.apiUrl}/sales`, sale, { headers });
  }

  updateSale(id: number, sale: any, username: string): Observable<Sale> {
    const headers = new HttpHeaders().set('X-Username', username);
    return this.http.put<Sale>(`${this.apiUrl}/sales/${id}`, sale, { headers });
  }

  deleteSale(id: number, username: string): Observable<void> {
    const headers = new HttpHeaders().set('X-Username', username);
    return this.http.delete<void>(`${this.apiUrl}/sales/${id}`, { headers });
  }

  getAudits(): Observable<Audit[]> {
    return this.http.get<Audit[]>(`${this.apiUrl}/audits`);
  }

  getAuditStats(): Observable<AuditStats> {
    return this.http.get<AuditStats>(`${this.apiUrl}/audits/stats`);
  }
}