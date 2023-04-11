import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { PartywisePOCounts } from 'src/app/models/partywisePOCounts';
import { PendingPODetailsByParty } from 'src/app/models/pendingPODtsByParty';
import { NotifyType } from 'src/app/models/notify';
import { FibreService } from 'src/app/services/fibre.service';
import { PartyService } from 'src/app/services/party.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-pending-fibre-po',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './pending-fibre-po.component.html',
  styleUrls: ['./pending-fibre-po.component.scss'],
})
export class PendingFibrePoComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  party = new FormControl();
  dataSource = new MatTableDataSource<PendingPODetailsByParty>([]);
  columnsToDisplay = [
    'poNo',
    'fibreType',
    'shade',
    'orderQty',
    'receivedQty',
    'balanceQty',
    'select',
  ];
  selection = new SelectionModel<PendingPODetailsByParty>(true, []);
  subscription = new Subscription();
  loader = false;
  partiesWithPendingPO!: PartywisePOCounts[];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public partyService: PartyService,
    private matDialogRef: MatDialogRef<PendingFibrePoComponent>,
    private notificationService: NotificationService,
    private fibreService: FibreService
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.fibreService
        .getPartywiswPendingPO()
        .subscribe((data) => (this.partiesWithPendingPO = data))
    );
    this.subscription.add(
      this.party.valueChanges.subscribe((partyId) => {
        this.loader = true;
        this.selection.clear();
        this.subscription.add(
          this.fibreService.getPendingPOByParty(partyId).subscribe((data) => {
            this.dataSource.data = data;
            this.loader = false;
          })
        );
      })
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  isLengthGreaterThan5() {
    return this.dataSource.data?.length > 5;
  }

  checkboxLabel(row?: any): string {
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }

  onChoose() {
    if (this.selection.selected.length === 0) {
      this.notificationService.notify(
        'Please select atleast one PO to choose!',
        NotifyType.ERROR
      );
      return;
    }
    this.matDialogRef.close({
      po: [...this.selection.selected],
      partyId: this.party.value,
    });
  }

  onCancel() {
    this.matDialogRef.close();
  }
}
