// src/app/components/sale-management/sale-management.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SaleService } from '../../services/sale.service';
import { Product } from '../../models/product.model';
import { Client } from '../../models/client.model';
import { Sale } from '../../models/sale.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sale-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule
  ],
  template: `
    <div class="p-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Formulaire de vente -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold mb-4 text-gray-800">
            {{ editingSale ? 'Modifier la vente' : 'Nouvelle vente' }}
          </h2>
          
          <form (ngSubmit)="onSubmit()" class="space-y-4">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Client</mat-label>
              <mat-select [(ngModel)]="selectedClientId" name="clientId" required>
                <mat-option *ngFor="let client of clients" [value]="client.id">
                  {{ client.name }}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Produit</mat-label>
              <mat-select [(ngModel)]="selectedProductId" name="productId" required>
                <mat-option *ngFor="let product of products" [value]="product.id">
                  {{ product.designation }} (Stock: {{ product.stock }})
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Quantité</mat-label>
              <input matInput type="number" [(ngModel)]="quantity" name="quantity" required min="1">
            </mat-form-field>

            <div class="flex gap-2">
              <button mat-raised-button color="primary" type="submit">
                {{ editingSale ? 'Modifier' : 'Ajouter' }}
              </button>
              <button mat-raised-button type="button" (click)="resetForm()" *ngIf="editingSale">
                Annuler
              </button>
            </div>
          </form>
        </div>

        <!-- Tableau des ventes -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold mb-4 text-gray-800">Liste des ventes</h2>
          
          <div class="overflow-x-auto">
            <table mat-table [dataSource]="sales" class="w-full">
              <ng-container matColumnDef="client">
                <th mat-header-cell *matHeaderCellDef>Client</th>
                <td mat-cell *matCellDef="let sale">{{ sale.client.name }}</td>
              </ng-container>

              <ng-container matColumnDef="product">
                <th mat-header-cell *matHeaderCellDef>Produit</th>
                <td mat-cell *matCellDef="let sale">{{ sale.product.designation }}</td>
              </ng-container>

              <ng-container matColumnDef="quantity">
                <th mat-header-cell *matHeaderCellDef>Quantité</th>
                <td mat-cell *matCellDef="let sale">{{ sale.quantity }}</td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let sale">
                  <button mat-icon-button color="primary" (click)="editSale(sale)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteSale(sale.id)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class SaleManagementComponent implements OnInit {
  products: Product[] = [];
  clients: Client[] = [];
  sales: Sale[] = [];
  
  selectedClientId: number | null = null;
  selectedProductId: number | null = null;
  quantity: number = 1;
  editingSale: Sale | null = null;
  
  displayedColumns: string[] = ['client', 'product', 'quantity', 'actions'];

  constructor(private saleService: SaleService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.saleService.getProducts().subscribe(data => this.products = data);
    this.saleService.getClients().subscribe(data => this.clients = data);
    this.saleService.getSales().subscribe(data => this.sales = data);
  }

  onSubmit(): void {
    if (!this.selectedClientId || !this.selectedProductId || !this.quantity) return;

    const saleData = {
      clientId: this.selectedClientId,
      productId: this.selectedProductId,
      quantity: this.quantity
    };

    const username = prompt('Entrez votre nom d\'utilisateur:', 'admin') || 'admin';

    if (this.editingSale) {
      this.saleService.updateSale(this.editingSale.id, saleData, username).subscribe(() => {
        this.loadData();
        this.resetForm();
      });
    } else {
      this.saleService.createSale(saleData, username).subscribe(() => {
        this.loadData();
        this.resetForm();
      });
    }
  }

  editSale(sale: Sale): void {
    this.editingSale = sale;
    this.selectedClientId = sale.client.id;
    this.selectedProductId = sale.product.id;
    this.quantity = sale.quantity;
  }

  deleteSale(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette vente ?')) {
      const username = prompt('Entrez votre nom d\'utilisateur:', 'admin') || 'admin';
      this.saleService.deleteSale(id, username).subscribe(() => {
        this.loadData();
      });
    }
  }

  resetForm(): void {
    this.editingSale = null;
    this.selectedClientId = null;
    this.selectedProductId = null;
    this.quantity = 1;
  }
}