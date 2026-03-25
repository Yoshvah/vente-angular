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
import { Client } from '../../models/client.model';
import { SaleService } from '../../service/sale.service';
import { ClientDialogComponent } from './client-dialog.component';

@Component({
  selector: 'app-clients',
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
        <h2 class="text-2xl font-bold text-gray-800">👥 Gestion des Clients</h2>
        <button
          (click)="openClientDialog()"
          class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 flex items-center gap-2">
          <mat-icon>person_add</mat-icon>
          Nouveau Client
        </button>
      </div>

      <!-- Search Filter -->
      <div class="mb-4">
        <mat-form-field class="w-full md:w-1/3">
          <mat-label>Rechercher un client</mat-label>
          <input matInput (keyup)="applyFilter($event)" placeholder="Nom du client">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
      </div>

      <!-- Clients Table -->
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table mat-table [dataSource]="filteredClients" class="w-full">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef class="bg-gray-50 px-4 py-3 text-left font-semibold">ID</th>
              <td mat-cell *matCellDef="let client" class="px-4 py-3">{{client.id}}</td>
            </ng-container>

            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef class="bg-gray-50 px-4 py-3 text-left font-semibold">Nom</th>
              <td mat-cell *matCellDef="let client" class="px-4 py-3 font-medium">{{client.name}}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef class="bg-gray-50 px-4 py-3 text-left font-semibold">Actions</th>
              <td mat-cell *matCellDef="let client" class="px-4 py-3">
                <button mat-icon-button color="primary" (click)="openClientDialog(client)" matTooltip="Modifier">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteClient(client.id)" matTooltip="Supprimer">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="hover:bg-gray-50"></tr>
            
            <tr class="mat-row" *matNoDataRow>
              <td class="mat-cell text-center py-8 text-gray-500" [attr.colspan]="displayedColumns.length">
                Aucun client trouvé
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  `
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  displayedColumns: string[] = ['id', 'name', 'actions'];

  constructor(
    private saleService: SaleService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.saleService.getClients().subscribe({
      next: (data) => {
        this.clients = data;
        this.filteredClients = data;
      },
      error: (error) => {
        console.error('Error loading clients:', error);
        this.snackBar.open('Erreur lors du chargement des clients', 'Fermer', { duration: 3000 });
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredClients = this.clients.filter(client => 
      client.name.toLowerCase().includes(filterValue)
    );
  }

  openClientDialog(client?: Client): void {
    const dialogRef = this.dialog.open(ClientDialogComponent, {
      width: '500px',
      data: client ? { ...client } : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadClients();
      }
    });
  }

  deleteClient(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      this.saleService.deleteClient(id).subscribe({
        next: () => {
          this.snackBar.open('Client supprimé avec succès', 'Fermer', { duration: 3000 });
          this.loadClients();
        },
        error: (error) => {
          console.error('Error deleting client:', error);
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
        }
      });
    }
  }
}