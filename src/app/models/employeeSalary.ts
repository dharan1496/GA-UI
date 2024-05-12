import { EmployeeDaywiseSalaryDetails } from './employeeDaywiseSalaryDetails';

export interface EmployeeSalary {
  employeeId: number;
  monthStartDate: string;
  salary: number;
  salaryCategoryName: string;
  deductionAmount: number;
  advanceDeduction: number;
  balanceAdvance: number;
  deductionRemarks: string;
  salaryBeforeDeduction: number;
  salaryDetails: EmployeeDaywiseSalaryDetails[];
}
