// src/app/components/audit/audit.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaleService } from '../../service/sale.service';
import { Audit } from '../../models/audit.model';
import { AuditStats } from '../../models/audit-stats.model';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="p-6">
      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <mat-card class="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <mat-card-content class="flex items-center justify-between p-4">
            <div>
              <h3 class="text-lg font-semibold mb-2">Insertions</h3>
              <p class="text-3xl font-bold">{{ auditStats?.insertCount || 0 }}</p>
            </div>
            <mat-icon class="text-4xl opacity-75">add_circle</mat-icon>
          </mat-card-content>
        </mat-card>

        <mat-card class="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <mat-card-content class="flex items-center justify-between p-4">
            <div>
              <h3 class="text-lg font-semibold mb-2">Modifications</h3>
              <p class="text-3xl font-bold">{{ auditStats?.updateCount || 0 }}</p>
            </div>
            <mat-icon class="text-4xl opacity-75">edit</mat-icon>
          </mat-card-content>
        </mat-card>

        <mat-card class="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <mat-card-content class="flex items-center justify-between p-4">
            <div>
              <h3 class="text-lg font-semibold mb-2">Suppressions</h3>
              <p class="text-3xl font-bold">{{ auditStats?.deleteCount || 0 }}</p>
            </div>
            <mat-icon class="text-4xl opacity-75">delete</mat-icon>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Audit Table -->
      <mat-card class="shadow-lg">
        <mat-card-header>
          <mat-card-title class="text-xl font-bold mb-4">
            <mat-icon class="mr-2">history</mat-icon>
            Journal des Opérations
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="overflow-x-auto">
            <table mat-table [dataSource]="audits" class="w-full">
              
              <ng-container matColumnDef="operationType">
                <th mat-header-cell *matHeaderCellDef class="bg-gray-50 px-4 py-3 text-left font-semibold">
                  Opération
                </th>
                <td mat-cell *matCellDef="let audit" class="px-4 py-3">
                  <span [class]="getOperationClass(audit.operationType)">
                    {{ audit.operationType }}
                  </span>
                 </td>
              </ng-container>

              <ng-container matColumnDef="updateDate">
                <th mat-header-cell *matHeaderCellDef class="bg-gray-50 px-4 py-3 text-left font-semibold">
                  Date
                </th>
                <td mat-cell *matCellDef="let audit" class="px-4 py-3">
                  {{ audit.updateDate | date:'dd/MM/yyyy HH:mm:ss' }}
                 </td>
              </ng-container>

              <ng-container matColumnDef="clientName">
                <th mat-header-cell *matHeaderCellDef class="bg-gray-50 px-4 py-3 text-left font-semibold">
                  Client
                </th>
                <td mat-cell *matCellDef="let audit" class="px-4 py-3">
                  {{ audit.clientName }}
                 </td>
              </ng-container>

              <ng-container matColumnDef="productDesignation">
                <th mat-header-cell *matHeaderCellDef class="bg-gray-50 px-4 py-3 text-left font-semibold">
                  Produit
                </th>
                <td mat-cell *matCellDef="let audit" class="px-4 py-3">
                  {{ audit.productDesignation }}
                 </td>
              </ng-container>

              <ng-container matColumnDef="quantity">
                <th mat-header-cell *matHeaderCellDef class="bg-gray-50 px-4 py-3 text-left font-semibold">
                  Quantité
                </th>
                <td mat-cell *matCellDef="let audit" class="px-4 py-3">
                  <span *ngIf="audit.oldQuantity !== null">
                    {{ audit.oldQuantity }} → {{ audit.newQuantity }}
                  </span>
                  <span *ngIf="audit.oldQuantity === null && audit.newQuantity !== null">
                    {{ audit.newQuantity }}
                  </span>
                 </td>
              </ng-container>

              <ng-container matColumnDef="username">
                <th mat-header-cell *matHeaderCellDef class="bg-gray-50 px-4 py-3 text-left font-semibold">
                  Utilisateur
                </th>
                <td mat-cell *matCellDef="let audit" class="px-4 py-3">
                  <mat-icon class="text-sm mr-1">person</mat-icon>
                  {{ audit.username }}
                 </td>
              </ng-container>

              <ng-container matColumnDef="hostMachine">
                <th mat-header-cell *matHeaderCellDef class="bg-gray-50 px-4 py-3 text-left font-semibold">
                  Machine
                </th>
                <td mat-cell *matCellDef="let audit" class="px-4 py-3">
                  <mat-icon class="text-sm mr-1">computer</mat-icon>
                  {{ audit.hostMachine }}
                 </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                  class="hover:bg-gray-50 transition duration-150"></tr>

              <tr class="mat-row" *matNoDataRow>
                <td class="mat-cell text-center py-8 text-gray-500" [attr.colspan]="displayedColumns.length">
                  <mat-icon class="text-4xl mb-2">history</mat-icon>
                  <p>Aucune opération d'audit trouvée</p>
                 </td>
              </tr>
            </table>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .bg-green-100 {
      background-color: #d1fae5;
    }
    .text-green-800 {
      color: #065f46;
    }
    .bg-blue-100 {
      background-color: #dbeafe;
    }
    .text-blue-800 {
      color: #1e40af;
    }
    .bg-red-100 {
      background-color: #fee2e2;
    }
    .text-red-800 {
      color: #991b1b;
    }
    .mat-mdc-card {
      margin-bottom: 1rem;
    }
  `]
})
export class AuditComponent implements OnInit {
  audits: Audit[] = [];
  auditStats: AuditStats | null = null;
  displayedColumns: string[] = [
    'operationType',
    'updateDate',
    'clientName',
    'productDesignation',
    'quantity',
    'username',
    'hostMachine'
  ];

  constructor(private saleService: SaleService) {}

  ngOnInit(): void {
    this.loadAudits();
    this.loadAuditStats();
  }

  loadAudits(): void {
    this.saleService.getAudits().subscribe({
      next: (data) => {
        this.audits = data;
      },
      error: (error) => {
        console.error('Error loading audits:', error);
      }
    });
  }

  loadAuditStats(): void {
    this.saleService.getAuditStats().subscribe({
      next: (data) => {
        this.auditStats = data;
      },
      error: (error) => {
        console.error('Error loading audit stats:', error);
      }
    });
  }

  getOperationClass(operationType: string): string {
    switch (operationType) {
      case 'INSERT':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-semibold';
      case 'UPDATE':
        return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-semibold';
      case 'DELETE':
        return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-semibold';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm font-semibold';
    }
  }
}