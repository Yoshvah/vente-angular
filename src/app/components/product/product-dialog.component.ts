import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Product } from '../../models/product.model';
import { SaleService } from '../../service/sale.service';

@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule
  ],
  template: `
    <h2 mat-dialog-title class="text-xl font-bold">
      {{ data ? '✏️ Modifier le produit' : '➕ Ajouter un produit' }}
    </h2>
    <mat-dialog-content>
      <div class="flex flex-col gap-4 py-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Désignation</mat-label>
          <input matInput [(ngModel)]="product.designation" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Stock</mat-label>
          <input matInput type="number" [(ngModel)]="product.stock" required min="0">
        </mat-form-field>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Annuler</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!isValid()">
        {{ data ? 'Modifier' : 'Ajouter' }}
      </button>
    </mat-dialog-actions>
  `
})
export class ProductDialogComponent {
  product: { designation: string; stock: number } = { designation: '', stock: 0 };

  constructor(
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product | null,
    private saleService: SaleService,
    private snackBar: MatSnackBar
  ) {
    if (data) {
      this.product = { designation: data.designation, stock: data.stock };
    }
  }

  isValid(): boolean {
    return this.product.designation.trim() !== '' && this.product.stock >= 0;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    const request = { designation: this.product.designation, stock: this.product.stock };
    
    if (this.data) {
      this.saleService.updateProduct(this.data.id, request).subscribe({
        next: () => {
          this.snackBar.open('Produit modifié avec succès', 'Fermer', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error updating product:', error);
          this.snackBar.open('Erreur lors de la modification', 'Fermer', { duration: 3000 });
        }
      });
    } else {
      this.saleService.createProduct(request).subscribe({
        next: () => {
          this.snackBar.open('Produit ajouté avec succès', 'Fermer', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error creating product:', error);
          this.snackBar.open('Erreur lors de l\'ajout', 'Fermer', { duration: 3000 });
        }
      });
    }
  }
}