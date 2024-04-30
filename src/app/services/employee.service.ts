import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSharedService } from '../shared/app-shared.service';
import { environment } from 'src/environment/environment';
import { Employee } from '../models/employee';
import { Observable } from 'rxjs';
import { MonthlyAttendance } from '../models/monthlyAttendance';
import { EmployeeSalaryDetails } from '../models/employeeSalaryDetails';
import { EmployeeDepartment } from '../models/EmployeeDepartment';
import { IDProof } from '../models/idProof';
import { SalaryCategory } from '../models/salaryCategory';
import { EmployeeSalary } from '../models/employeeSalary';
import { MonthlySalarySummary } from '../models/monthlySalarySummary';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(
    private http: HttpClient,
    private appSharedService: AppSharedService
  ) {}

  addEmployee(employee: Employee) {
    return this.http.post(
      `${environment.api}/Employee/AddEmployee?createdByUserId=${this.appSharedService.userId}`,
      employee,
      {
        responseType: 'text',
      }
    );
  }

  getEmployeeById(employeeId: number): Observable<Employee> {
    return this.http.get<Employee>(
      `${environment.api}/Employee/GetEmployeeById?employeeId=${employeeId}`
    );
  }

  saveMonthlyAttendance(
    monthlyAttendance: MonthlyAttendance[],
    monthStartDate: string
  ) {
    return this.http.post(
      `${environment.api}/Employee/SaveMonthlyAttendance?monthStartDate=${monthStartDate}&createdByUserId=${this.appSharedService.userId}`,
      monthlyAttendance,
      {
        responseType: 'text',
      }
    );
  }

  saveSalaryAdvance(
    employeeId: number,
    advanceDate: string,
    advanceAmount: number,
    remarks: string
  ) {
    return this.http.post(
      `${environment.api}/Employee/SaveSalaryAdvance?employeeId=${employeeId}&advanceDate=${advanceDate}&advanceAmount=${advanceAmount}&remarks=${remarks}&createdByUserId=${this.appSharedService.userId}`,
      {},
      {
        responseType: 'text',
      }
    );
  }

  getMonthlyAttendanceById(
    employeeId: number,
    monthStartDate: string
  ): Observable<MonthlyAttendance[]> {
    return this.http.get<MonthlyAttendance[]>(
      `${environment.api}/Employee/GetMonthlyAttendanceById?employeeId=${employeeId}&monthStartDate=${monthStartDate}`
    );
  }

  saveSalary(
    employeeId: number,
    salaryMonthStartDate: string,
    salaryAmount: number,
    deductionAmount: number,
    employeeSalaryDetails: EmployeeSalaryDetails[]
  ) {
    return this.http.post(
      `${environment.api}/Employee/SaveSalary?employeeId=${employeeId}&salaryMonthStartDate=${salaryMonthStartDate}&salaryAmount=${salaryAmount}&deductionAmount=${deductionAmount}&createdByUserId=${this.appSharedService.userId}`,
      employeeSalaryDetails,
      {
        responseType: 'text',
      }
    );
  }

  getEmployeeDepartmentMasters(): Observable<EmployeeDepartment[]> {
    return this.http.get<EmployeeDepartment[]>(
      `${environment.api}/Employee/GetEmployeeDepartmentMasters`
    );
  }

  getActiveEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(
      `${environment.api}/Employee/GetActiveEmployees`
    );
  }

  getIDProofs(): Observable<IDProof[]> {
    return this.http.get<IDProof[]>(
      `${environment.api}/Employee/GetIDProofMasters`
    );
  }

  getSalaryCategories(): Observable<SalaryCategory[]> {
    return this.http.get<SalaryCategory[]>(
      `${environment.api}/Employee/GetSalaryCategoryMasters`
    );
  }

  getEmployeeMonthlySalaryDetails(
    employeeId: number,
    monthStartDate: string
  ): Observable<EmployeeSalary> {
    return this.http.get<EmployeeSalary>(
      `${environment.api}/Employee/GetEmployeeMonthlySalaryDetails?employeeId=${employeeId}&monthStartDate=${monthStartDate}`
    );
  }

  getMonthlySalarySummary(
    salaryMonthDate: string
  ): Observable<MonthlySalarySummary[]> {
    return this.http.get<MonthlySalarySummary[]>(
      `${environment.api}/Employee/GetMonthlySalarySummary?salaryMonthDate=${salaryMonthDate}`
    );
  }
}
