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
    private notificationService: NotificationService
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
      this.partyService
        .getParties()
        .subscribe((data) => (this.partyService.parties = data))
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
          this.partyService.deleteParty(party.partyId).subscribe(
            (response) => {
              if (response) {
                this.getParty();
                this.notificationService.success('Party deleted successfully!');
              } else {
                this.notificationService.success('Unable to delete the Party!');
              }
            },
            (error) =>
              this.notificationService.error(error?.error || error?.message)
          );
        }
      });
  }
}
