import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
  DateAdapter,
} from '@angular/material/core';
import { MaterialModule } from 'src/app/material.module';
import { AppSharedService } from 'src/app/shared/app-shared.service';

export const MY_FORMATS_DD = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-salary-date-range',
  templateUrl: './salary-date-range.component.html',
  styleUrls: [],
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS_DD },
  ],
})
export class SalaryDateRangeComponent {
  @Input() monthStartDate!: FormControl;
  @Input() monthEndDate!: FormControl;

  constructor(public appSharedService: AppSharedService) {}
}
