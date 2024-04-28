import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Constants } from 'src/app/constants/constants';
import { EMPLOYEE } from 'src/app/constants/employee-menu-values.const';
import { Employee } from 'src/app/models/employee';
import { EmployeeService } from 'src/app/services/employee.service';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { NavigationService } from 'src/app/shared/navigation.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  subscription = new Subscription();
  dataSource = new MatTableDataSource<Employee>([]);
  displayedColumns = [
    'employeeId',
    'firstName',
    'departmentName',
    'address',
    'idProofType',
    'idProof',
    'salaryCategoryName',
    'salary',
    'contactNo',
    'dateOfJoining',
    'allowedLeaveDays',
  ];
  loader = false;
  private paginator!: MatPaginator;
  private sort!: MatSort;

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  constructor(
    public appSharedService: AppSharedService,
    private navigationService: NavigationService,
    public employeeService: EmployeeService,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {
    this.navigationService.isSidenavOpened = true;
    this.navigationService.setFocus(Constants.EMPLOYEE);
    this.navigationService.menu = EMPLOYEE;
  }

  ngOnInit() {
    this.subscription.add(
      this.employeeService.getActiveEmployees().subscribe({
        next: (response) => {
          this.dataSource.data = response;
        },
        error: (error) =>
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          ),
      })
    );
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  openEmployeeDetails(employee: Employee) {
    this.dialog.open(EmployeeDetailsComponent, {
      data: employee,
      minWidth: '75vw',
    });
  }
}
