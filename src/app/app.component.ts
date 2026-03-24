import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaleManagementComponent } from './components/sale-management/sale-management.component';
import { AuditComponent } from './components/audit/audit.component';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SaleManagementComponent, AuditComponent, MatTabsModule],
  template: `
    <div class="container mx-auto p-6">
      <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">
        Gestion des Ventes
      </h1>
      
      <mat-tab-group>
        <mat-tab label="Gestion des Ventes">
          <app-sale-management></app-sale-management>
        </mat-tab>
        <mat-tab label="Audit des Ventes">
          <app-audit></app-audit>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: []
})
export class AppComponent {
  title = 'Employee-angular';
}