// src/app/employee-dialog/employee-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-employee-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <div class="p-6">
      <h2 class="text-xl font-bold mb-4">{{data.isEdit ? 'Modifier' : 'Ajouter'}} un employé</h2>
      
      <form #employeeForm="ngForm" (ngSubmit)="onSubmit()">
        <div class="mb-4">
          <mat-form-field class="w-full">
            <mat-label>Nom</mat-label>
            <input matInput [(ngModel)]="employee.nom" name="nom" required>
          </mat-form-field>
        </div>
        
        <div class="mb-4">
          <mat-form-field class="w-full">
            <mat-label>Salaire</mat-label>
            <input matInput type="number" [(ngModel)]="employee.salaire" name="salaire" required>
          </mat-form-field>
        </div>
        
        <div class="flex justify-end gap-2">
          <button mat-button type="button" (click)="onCancel()">Annuler</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="!employeeForm.form.valid">
            {{data.isEdit ? 'Modifier' : 'Ajouter'}}
          </button>
        </div>
      </form>
    </div>
  `
})
export class EmployeeDialogComponent {
  employee: any;

  constructor(
    public dialogRef: MatDialogRef<EmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.employee = { ...data.employee };
  }

  onSubmit() {
    this.dialogRef.close(this.employee);
  }

  onCancel() {
    this.dialogRef.close();
  }
}