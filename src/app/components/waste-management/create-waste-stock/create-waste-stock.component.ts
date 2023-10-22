import { Component, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Constants } from 'src/app/constants/constants';
import { WASTE } from 'src/app/constants/waste-menu-values.const';
import { CreateFibreWaste } from 'src/app/models/createFibreWaste';
import { FibreWasteCategory } from 'src/app/models/fibreWasteCategory';
import { NotifyType } from 'src/app/models/notify';
import { FibreService } from 'src/app/services/fibre.service';
import { NavigationService } from 'src/app/shared/navigation.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { UserActionConfirmationComponent } from '../../user-action-confirmation/user-action-confirmation.component';
import { WasteDialogComponent } from './waste-dialog/waste-dialog.component';

@Component({
  selector: 'app-create-waste-stock',
  templateUrl: './create-waste-stock.component.html',
  styleUrls: ['./create-waste-stock.component.scss'],
})
export class CreateWasteStockComponent implements OnDestroy {
  displayedColumns = ['sNo', 'wasteCategoryName', 'quantity', 'button'];
  dataSource: CreateFibreWaste[] = [];
  subscription = new Subscription();
  wasteList!: FibreWasteCategory[];
  @ViewChild(MatTable) table!: MatTable<any>;

  constructor(
    private navigationService: NavigationService,
    private fibreService: FibreService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {
    this.navigationService.setFocus(Constants.WASTE);
    this.navigationService.menu = WASTE;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  addData() {
    this.dialog
      .open(WasteDialogComponent, {
        data: this.dataSource.length,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.dataSource.push(result);
          this.table.renderRows();
        }
      });
  }

  updateData(selectedRow: any) {
    this.dialog
      .open(WasteDialogComponent, {
        data: selectedRow,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.dataSource.forEach((data: any, index: number) => {
            if (data?.orderNo === result?.orderNo) {
              this.dataSource[index] = result as never;
            }
          });
        }
        this.table.renderRows();
      });
  }

  removeData(selectedRow: any) {
    this.dialog
      .open(UserActionConfirmationComponent)
      .afterClosed()
      .subscribe((result: boolean) => {
        if (result) {
          const newList: any = [];
          this.dataSource.forEach((data: any) => {
            if (data != selectedRow) {
              newList.push(data);
            }
          });
          this.dataSource = newList;
          this.table.renderRows();
        }
      });
  }

  submit() {
    if (this.dataSource?.length === 0) {
      this.notificationService.notify(
        'Please add atleast one waste to submit',
        NotifyType.ERROR
      );
      return;
    }
    const wastes: CreateFibreWaste[] = this.dataSource.map((data) => ({
      wasteCategoryId: data?.wasteCategoryId,
      wasteCategoryName: data?.wasteCategoryName,
      quantity: data?.quantity,
    }));
    this.subscription.add(
      this.fibreService.saveFiberWaste(wastes).subscribe({
        next: (response) => {
          this.notificationService.success(response);
          this.resetData();
        },
        error: (error) =>
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          ),
      })
    );
  }

  resetData() {
    this.dataSource = [];
    this.table.renderRows();
  }
}
