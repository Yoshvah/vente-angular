import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Client } from '../../models/client.model';
import { SaleService } from '../../service/sale.service';

@Component({
  selector: 'app-client-dialog',
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
      {{ data ? '✏️ Modifier le client' : '➕ Ajouter un client' }}
    </h2>
    <mat-dialog-content>
      <div class="flex flex-col gap-4 py-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Nom du client</mat-label>
          <input matInput [(ngModel)]="clientName" required>
        </mat-form-field>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Annuler</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!clientName.trim()">
        {{ data ? 'Modifier' : 'Ajouter' }}
      </button>
    </mat-dialog-actions>
  `
})
export class ClientDialogComponent {
  clientName: string = '';

  constructor(
    public dialogRef: MatDialogRef<ClientDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Client | null,
    private saleService: SaleService,
    private snackBar: MatSnackBar
  ) {
    if (data) {
      this.clientName = data.name;
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    const request = { name: this.clientName };
    
    if (this.data) {
      this.saleService.updateClient(this.data.id, request).subscribe({
        next: () => {
          this.snackBar.open('Client modifié avec succès', 'Fermer', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error updating client:', error);
          this.snackBar.open('Erreur lors de la modification', 'Fermer', { duration: 3000 });
        }
      });
    } else {
      this.saleService.createClient(request).subscribe({
        next: () => {
          this.snackBar.open('Client ajouté avec succès', 'Fermer', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error creating client:', error);
          this.snackBar.open('Erreur lors de l\'ajout', 'Fermer', { duration: 3000 });
        }
      });
    }
  }
}