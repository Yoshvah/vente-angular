// src/app/app.component.ts
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Chart, registerables } from 'chart.js';

import { EmployeeService } from './services/employee.service';
import { Employee, SalaryStats } from './models/employee.model';
import { EmployeeDialogComponent } from './employee-dialog/employee-dialog.component';

Chart.register(...registerables);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'Employee-angular';
  displayedColumns: string[] = ['nom', 'salaire', 'obs', 'actions'];
  dataSource = new MatTableDataSource<Employee>();
  salaryStats: SalaryStats = { total: 0, min: 0, max: 0 };
  
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadEmployees();
    this.loadStats();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  loadEmployees() {
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (error) => {
        this.showMessage('Erreur lors du chargement des employés');
        console.error('Error loading employees:', error);
      }
    });
  }

  loadStats() {
    this.employeeService.getSalaryStats().subscribe({
      next: (stats) => {
        this.salaryStats = stats;
        setTimeout(() => this.createChart(), 100); // Small delay to ensure DOM is ready
      },
      error: (error) => {
        console.error('Error loading stats:', error);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(EmployeeDialogComponent, {
      width: '400px',
      data: { employee: { nom: '', salaire: 0 }, isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employeeService.createEmployee(result).subscribe({
          next: () => {
            this.loadEmployees();
            this.loadStats();
            this.showMessage('Employé ajouté avec succès');
          },
          error: (error) => {
            this.showMessage("Erreur lors de l'ajout");
            console.error('Error adding employee:', error);
          }
        });
      }
    });
  }

  openEditDialog(employee: Employee) {
    const dialogRef = this.dialog.open(EmployeeDialogComponent, {
      width: '400px',
      data: { employee: { ...employee }, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && employee.numEmp) {
        this.employeeService.updateEmployee(employee.numEmp, result).subscribe({
          next: () => {
            this.loadEmployees();
            this.loadStats();
            this.showMessage('Employé modifié avec succès');
          },
          error: (error) => {
            this.showMessage('Erreur lors de la modification');
            console.error('Error updating employee:', error);
          }
        });
      }
    });
  }

  deleteEmployee(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          this.loadEmployees();
          this.loadStats();
          this.showMessage('Employé supprimé avec succès');
        },
        error: (error) => {
          this.showMessage('Erreur lors de la suppression');
          console.error('Error deleting employee:', error);
        }
      });
    }
  }

  getObservationClass(obs: string): string {
    switch(obs) {
      case 'médiocre':
        return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold';
      case 'moyen':
        return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold';
      case 'grand':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold';
    }
  }

  createChart() {
    const ctx = document.getElementById('salaryChart') as HTMLCanvasElement;
    if (ctx) {
      // Destroy existing chart if it exists
      const existingChart = Chart.getChart(ctx);
      if (existingChart) {
        existingChart.destroy();
      }

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Salaire Total', 'Salaire Min', 'Salaire Max'],
          datasets: [{
            label: 'Salaires (€)',
            data: [this.salaryStats.total || 0, this.salaryStats.min || 0, this.salaryStats.max || 0],
            backgroundColor: [
              'rgba(54, 162, 235, 0.5)',
              'rgba(75, 192, 192, 0.5)',
              'rgba(255, 159, 64, 0.5)'
            ],
            borderColor: [
              'rgb(54, 162, 235)',
              'rgb(75, 192, 192)',
              'rgb(255, 159, 64)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return value + ' €';
                }
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.raw + ' €';
                }
              }
            }
          }
        }
      });
    }
  }

  showMessage(message: string) {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}