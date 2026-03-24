import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <mat-card class="w-full max-w-md p-8 shadow-2xl">
        <mat-card-header class="flex justify-center mb-6">
          <mat-card-title class="text-3xl font-bold text-center text-gray-800">
            🔐 Connexion
          </mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form (ngSubmit)="onSubmit()" class="flex flex-col gap-5">
            <!-- Username Field -->
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Nom d'utilisateur</mat-label>
              <input 
                matInput 
                [(ngModel)]="username" 
                name="username" 
                required
                placeholder="Entrez votre nom d'utilisateur"
                autocomplete="username">
              <mat-icon matSuffix>person</mat-icon>
              <mat-error *ngIf="!username">
                Le nom d'utilisateur est requis
              </mat-error>
            </mat-form-field>
            
            <!-- Password Field -->
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Mot de passe</mat-label>
              <input 
                matInput 
                [type]="hidePassword ? 'password' : 'text'"
                [(ngModel)]="password" 
                name="password" 
                required
                placeholder="Entrez votre mot de passe"
                autocomplete="current-password">
              <button 
                mat-icon-button 
                matSuffix 
                type="button"
                (click)="hidePassword = !hidePassword">
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="!password">
                Le mot de passe est requis
              </mat-error>
            </mat-form-field>
            
            <!-- Error Message -->
            <div *ngIf="errorMessage" class="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div class="flex items-center">
                <mat-icon class="text-red-500 mr-2">error</mat-icon>
                <span class="text-red-700 text-sm">{{ errorMessage }}</span>
              </div>
            </div>
            
            <!-- Success Message -->
            <div *ngIf="successMessage" class="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <div class="flex items-center">
                <mat-icon class="text-green-500 mr-2">check_circle</mat-icon>
                <span class="text-green-700 text-sm">{{ successMessage }}</span>
              </div>
            </div>
            
            <!-- Submit Button -->
            <button 
              mat-raised-button 
              color="primary" 
              type="submit" 
              [disabled]="!username || !password || isLoading"
              class="h-12 text-base font-semibold">
              <div class="flex items-center justify-center gap-2">
                <mat-icon *ngIf="!isLoading">login</mat-icon>
                <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
                <span>{{ isLoading ? 'Connexion en cours...' : 'Se connecter' }}</span>
              </div>
            </button>
            
            <!-- Register Link -->
            <div class="text-center mt-4">
              <span class="text-gray-600">Pas encore de compte ? </span>
              <button 
                mat-button 
                type="button" 
                (click)="goToRegister()"
                class="text-blue-600 font-semibold">
                Créer un compte
                <mat-icon class="ml-1">arrow_forward</mat-icon>
              </button>
            </div>
            
            <!-- Demo Credentials -->
            <div class="mt-6 pt-4 border-t border-gray-200">
              <p class="text-xs text-gray-500 text-center mb-2">
                🔑 Comptes de démonstration
              </p>
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div class="bg-gray-50 p-2 rounded">
                  <p class="font-semibold">👑 Admin</p>
                  <p>admin / password</p>
                </div>
                <div class="bg-gray-50 p-2 rounded">
                  <p class="font-semibold">👤 User</p>
                  <p>john / password</p>
                </div>
              </div>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
    .mat-mdc-card {
      border-radius: 16px;
    }
    .mat-mdc-form-field {
      width: 100%;
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  hidePassword = true;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  onSubmit(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.isLoading = false;
        this.successMessage = 'Connexion réussie ! Redirection...';
        
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);
      },
      error: (error) => {
        console.error('Login error:', error);
        this.isLoading = false;
        this.errorMessage = error.message || 'Nom d\'utilisateur ou mot de passe incorrect';
        this.password = '';
      }
    });
  }
  
  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}