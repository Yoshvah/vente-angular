import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
            📝 Inscription
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
                placeholder="Choisissez un nom d'utilisateur">
              <mat-icon matSuffix>person_add</mat-icon>
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
                minlength="4">
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
              <mat-error *ngIf="password && password.length < 4">
                Le mot de passe doit contenir au moins 4 caractères
              </mat-error>
            </mat-form-field>
            
            <!-- Confirm Password Field -->
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Confirmer le mot de passe</mat-label>
              <input 
                matInput 
                [type]="hideConfirmPassword ? 'password' : 'text'"
                [(ngModel)]="confirmPassword" 
                name="confirmPassword" 
                required>
              <button 
                mat-icon-button 
                matSuffix 
                type="button"
                (click)="hideConfirmPassword = !hideConfirmPassword">
                <mat-icon>{{hideConfirmPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="!confirmPassword">
                Veuillez confirmer votre mot de passe
              </mat-error>
              <mat-error *ngIf="confirmPassword && password !== confirmPassword">
                Les mots de passe ne correspondent pas
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
              [disabled]="!username || !password || !confirmPassword || password !== confirmPassword || isLoading"
              class="h-12 text-base font-semibold">
              <div class="flex items-center justify-center gap-2">
                <mat-icon *ngIf="!isLoading">how_to_reg</mat-icon>
                <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
                <span>{{ isLoading ? 'Inscription en cours...' : 'S\'inscrire' }}</span>
              </div>
            </button>
            
            <!-- Login Link -->
            <div class="text-center mt-4">
              <span class="text-gray-600">Déjà un compte ? </span>
              <button 
                mat-button 
                type="button" 
                (click)="goToLogin()"
                class="text-blue-600 font-semibold">
                Se connecter
                <mat-icon class="ml-1">login</mat-icon>
              </button>
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
export class RegisterComponent {
  username = '';
  password = '';
  confirmPassword = '';
  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  onSubmit(): void {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }
    
    if (this.password.length < 4) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 4 caractères';
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    this.authService.register(this.username, this.password).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.isLoading = false;
        this.successMessage = 'Inscription réussie ! Redirection vers la page de connexion...';
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        console.error('Registration error:', error);
        this.isLoading = false;
        this.errorMessage = error.message || 'Erreur lors de l\'inscription';
      }
    });
  }
  
  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}