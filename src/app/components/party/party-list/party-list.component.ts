import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Constants } from 'src/app/constants/constants';
import { PARTY } from 'src/app/constants/party-menu-values.const';
import { Party } from 'src/app/models/party';
import { PartyService } from 'src/app/services/party.service';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { NavigationService } from 'src/app/shared/navigation.service';
import { UserActionConfirmationComponent } from '../../user-action-confirmation/user-action-confirmation.component';
import { NotificationService } from 'src/app/shared/notification.service';
import { NgxMaskPipe } from 'ngx-mask';
import { MatExpansionPanel } from '@angular/material/expansion';

@Component({
  selector: 'app-party-list',
  templateUrl: './party-list.component.html',
  styleUrls: ['./party-list.component.scss'],
})
export class PartyListComponent implements OnInit {
  subscription = new Subscription();

  constructor(
    public appSharedService: AppSharedService,
    private navigationService: NavigationService,
    public partyService: PartyService,
    private router: Router,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private maskPipe: NgxMaskPipe
  ) {
    this.navigationService.isSidenavOpened = true;
    this.navigationService.setFocus(Constants.PARTY);
    this.navigationService.menu = PARTY;
  }

  ngOnInit() {
    this.getParty();
  }

  getParty() {
    this.subscription.add(
      this.partyService.getParties().subscribe({
        next: (data) => (this.partyService.parties = data),
        error: (error) =>
          this.notificationService.error(error?.error || error?.message),
      })
    );
  }

  editParty(party: Party) {
    this.partyService.editPartyDetails = party;
    this.router.navigateByUrl('/party/update');
  }

  removeParty(party: Party) {
    this.dialog
      .open(UserActionConfirmationComponent)
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          this.partyService.deleteParty(party.partyId).subscribe({
            next: (response) => {
              if (response) {
                this.getParty();
                this.notificationService.success('Party deleted successfully!');
              } else {
                this.notificationService.success('Unable to delete the Party!');
              }
            },
            error: (error) =>
              this.notificationService.error(error?.error || error?.message),
          });
        }
      });
  }

  getContactNo(contactNo: string) {
    if (contactNo.includes(',')) {
      const noArr = contactNo.split(',');
      if (noArr.length > 1 && noArr[noArr.length - 1].length > 10) {
        return `${noArr
          .slice(0, noArr.length - 1)
          .filter((no) => !!no)
          .join(', ')}, ${this.maskPipe.transform(
          noArr[noArr.length - 1],
          '00000-000000'
        )}`;
      }
      return noArr.filter((no) => !!no).join(', ');
    }
    return contactNo;
  }

  open(panel: MatExpansionPanel) {
    document
      .getElementById(panel.id)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
