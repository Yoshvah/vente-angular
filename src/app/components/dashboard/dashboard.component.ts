import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ProductsComponent } from '../product/products.component';
import { ClientsComponent } from '../clients/clients.component';
import { SaleManagementComponent } from '../sale-management/sale-management.component';
import { AuditComponent } from '../audit/audit.component';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    ProductsComponent,
    ClientsComponent,
    SaleManagementComponent,
    AuditComponent
  ],
  template: `
    <div class="min-h-screen bg-gray-100">
      <!-- Header -->
      <header class="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg sticky top-0 z-50">
        <div class="container mx-auto px-4 py-4">
          <div class="flex justify-between items-center flex-wrap gap-4">
            <h1 class="text-xl md:text-2xl font-bold">🏪 Gestion Commerciale</h1>
            
            <div class="flex items-center gap-4">
              <span class="text-sm hidden md:inline">
                Bonjour, {{ username }}
                <span *ngIf="isAdmin" class="ml-2 bg-yellow-500 text-xs px-2 py-1 rounded-full">
                  Admin
                </span>
              </span>
              
              <button mat-icon-button [matMenuTriggerFor]="menu" class="text-white">
                <mat-icon>account_circle</mat-icon>
              </button>
              <mat-menu #menu="matMenu">
                <button mat-menu-item (click)="logout()">
                  <mat-icon>exit_to_app</mat-icon>
                  <span>Déconnexion</span>
                </button>
              </mat-menu>
            </div>
          </div>
        </div>
      </header>
      
      <!-- Main Content -->
      <main class="container mx-auto px-4 py-8">
        <mat-tab-group>
          <mat-tab label="📦 Produits">
            <app-products></app-products>
          </mat-tab>
          
          <mat-tab label="👥 Clients">
            <app-clients></app-clients>
          </mat-tab>
          
          <mat-tab label="💰 Ventes">
            <app-sale-management></app-sale-management>
          </mat-tab>
          
          <mat-tab *ngIf="isAdmin" label="📋 Audit">
            <app-audit></app-audit>
          </mat-tab>
        </mat-tab-group>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    ::ng-deep .mat-mdc-tab-group {
      background: transparent;
    }
    ::ng-deep .mat-mdc-tab-header {
      background: white;
      border-radius: 8px;
      margin-bottom: 1rem;
    }
  `]
})
export class DashboardComponent implements OnInit {
  username: string = '';
  isAdmin: boolean = false;
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user) {
      this.username = user.username;
      this.isAdmin = this.authService.isAdmin();
    }
  }
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}