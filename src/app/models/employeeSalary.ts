import { EmployeeDaywiseSalaryDetails } from './employeeDaywiseSalaryDetails';

export interface EmployeeSalary {
  employeeId: number;
  monthStartDate: string;
  salary: number;
  salaryCategoryName: string;
  deductionAmount: number;
  salaryBeforeDeduction: number;
  salaryDetails: EmployeeDaywiseSalaryDetails[];
}
