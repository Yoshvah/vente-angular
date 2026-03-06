// src/app/models/employee.model.ts
export interface Employee {
  numEmp?: number;
  nom: string;
  salaire: number;
  obs?: string;
}

export interface SalaryStats {
  total: number;
  min: number;
  max: number;
}