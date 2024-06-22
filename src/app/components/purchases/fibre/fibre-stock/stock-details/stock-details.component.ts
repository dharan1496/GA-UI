import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription, finalize } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { FibreIssueDetails } from 'src/app/models/fibreIssueDetails';
import { FibreStock } from 'src/app/models/fibreStock';
import { FibreService } from 'src/app/services/fibre.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-stock-details',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './stock-details.component.html',
  styleUrls: ['./stock-details.component.scss'],
})
export class StockDetailsComponent implements OnInit, OnDestroy {
  subscription = new Subscription();
  columnsToDisplay = ['issuedDate', 'ProgramNo', 'issuedQty'];
  dataSource: FibreIssueDetails[] = [];
  loader = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public fibreStock: FibreStock,
    private matDialogRef: MatDialogRef<any>,
    private notificationService: NotificationService,
    private fibreService: FibreService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.fibreService
        .getFiberConsumption(this.fibreStock.receivedDtsId)
        .pipe(finalize(() => (this.loader = false)))
        .subscribe({
          next: (data) => (this.dataSource = data),
          error: (error) =>
            this.notificationService.error(
              typeof error?.error === 'string' ? error?.error : error?.message
            ),
        })
    );
  }

  formatDate(date: string) {
    if (!date) {
      return '';
    }

    const splittedDate = date?.split(' ')[0]?.split('/');

    return `${splittedDate[1]}/${splittedDate[0]}/${splittedDate[2]}`;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  close() {
    this.matDialogRef.close();
  }
}
