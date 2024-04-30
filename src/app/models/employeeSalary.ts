import { EmployeeDaywiseSalaryDetails } from './employeeDaywiseSalaryDetails';

export interface EmployeeSalary {
  employeeId: number;
  monthStartDate: string;
  salaryAmount: number;
  deductionAmount: number;
  salaryDetails: EmployeeDaywiseSalaryDetails[];
}
