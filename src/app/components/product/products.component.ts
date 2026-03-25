import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Product, ProductRequest } from '../../models/product.model';
import { SaleService } from '../../service/sale.service';
import { ProductDialogComponent } from './product-dialog.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatInputModule,
    MatFormFieldModule
  ],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">📦 Gestion des Produits</h2>
        <button
          (click)="openProductDialog()"
          class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 flex items-center gap-2">
          <mat-icon>add</mat-icon>
          Nouveau Produit
        </button>
      </div>

      <!-- Search Filter -->
      <div class="mb-4">
        <mat-form-field class="w-full md:w-1/3">
          <mat-label>Rechercher un produit</mat-label>
          <input matInput (keyup)="applyFilter($event)" placeholder="Nom du produit">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
      </div>

      <!-- Products Table -->
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table mat-table [dataSource]="filteredProducts" class="w-full">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef class="bg-gray-50 px-4 py-3 text-left font-semibold">ID</th>
              <td mat-cell *matCellDef="let product" class="px-4 py-3">{{product.id}}</td>
            </ng-container>

            <ng-container matColumnDef="designation">
              <th mat-header-cell *matHeaderCellDef class="bg-gray-50 px-4 py-3 text-left font-semibold">Désignation</th>
              <td mat-cell *matCellDef="let product" class="px-4 py-3 font-medium">{{product.designation}}</td>
            </ng-container>

            <ng-container matColumnDef="stock">
              <th mat-header-cell *matHeaderCellDef class="bg-gray-50 px-4 py-3 text-left font-semibold">Stock</th>
              <td mat-cell *matCellDef="let product" class="px-4 py-3">
                <span [class]="product.stock < 10 ? 'text-red-600 font-bold' : 'text-green-600'">
                  {{product.stock}}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef class="bg-gray-50 px-4 py-3 text-left font-semibold">Actions</th>
              <td mat-cell *matCellDef="let product" class="px-4 py-3">
                <button mat-icon-button color="primary" (click)="openProductDialog(product)" matTooltip="Modifier">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteProduct(product.id)" matTooltip="Supprimer">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="hover:bg-gray-50"></tr>
            
            <tr class="mat-row" *matNoDataRow>
              <td class="mat-cell text-center py-8 text-gray-500" [attr.colspan]="displayedColumns.length">
                Aucun produit trouvé
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .mat-mdc-row:hover {
      background-color: #f9fafb;
    }
  `]
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  displayedColumns: string[] = ['id', 'designation', 'stock', 'actions'];

  constructor(
    private saleService: SaleService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.saleService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.snackBar.open('Erreur lors du chargement des produits', 'Fermer', { duration: 3000 });
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredProducts = this.products.filter(product => 
      product.designation.toLowerCase().includes(filterValue)
    );
  }

  openProductDialog(product?: Product): void {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '500px',
      data: product ? { ...product } : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
      }
    });
  }

  deleteProduct(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.saleService.deleteProduct(id).subscribe({
        next: () => {
          this.snackBar.open('Produit supprimé avec succès', 'Fermer', { duration: 3000 });
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
        }
      });
    }
  }
}