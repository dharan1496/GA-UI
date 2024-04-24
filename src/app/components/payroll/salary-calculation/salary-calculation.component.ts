import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Constants } from 'src/app/constants/constants';
import { PAYROLL } from 'src/app/constants/payroll-menu-values.const';
import { EmployeeService } from 'src/app/services/employee.service';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { NavigationService } from 'src/app/shared/navigation.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-salary-calculation',
  templateUrl: './salary-calculation.component.html',
  styleUrls: ['./salary-calculation.component.scss'],
})
export class SalaryCalculationComponent {
  constructor(
    private notificationService: NotificationService,
    public appSharedService: AppSharedService,
    private navigationService: NavigationService,
    private employeeService: EmployeeService,
    private datePipe: DatePipe
  ) {
    this.navigationService.setFocus(Constants.PAYROLL);
    this.navigationService.menu = PAYROLL;
  }
}
