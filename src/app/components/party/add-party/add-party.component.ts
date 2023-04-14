import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Constants } from 'src/app/constants/constants';
import { PARTY } from 'src/app/constants/party-menu-values.const';
import { STATES, STATE_CODE } from 'src/app/constants/state-list.const';
import { NotifyType } from 'src/app/models/notify';
import { PartyService } from 'src/app/services/party.service';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { NavigationService } from 'src/app/shared/navigation.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-add-party',
  templateUrl: './add-party.component.html',
  styleUrls: ['./add-party.component.scss'],
})
export class AddPartyComponent implements OnInit {
  form!: FormGroup;
  stateList = STATES;
  edit = false;

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    public appSharedService: AppSharedService,
    private navigationService: NavigationService,
    private partyService: PartyService,
    private router: Router
  ) {
    this.navigationService.setFocus(Constants.PARTY);
    this.navigationService.menu = PARTY;
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      partyName: ['', Validators.required],
      branchName: ['', Validators.required],
      gstno: ['', Validators.required],
      address1: ['', Validators.required],
      address2: '',
      address3: '',
      district: ['', Validators.required],
      city: ['', Validators.required],
      state: ['Tamil Nadu', Validators.required],
      pincode: ['', Validators.required],
      emailId: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      mobileNo: ['', Validators.required],
      landline: '',
    });

    if (this.partyService.editPartyDetails) {
      this.edit = true;
      const contact = this.partyService.editPartyDetails.contactNo?.split(',');
      this.form.patchValue({
        ...this.partyService.editPartyDetails,
        mobileNo: contact?.length ? contact[0]?.trim() : '',
        landline: contact?.length ? contact[1]?.trim() : '',
      });
      this.partyService.editPartyDetails = undefined;
    }
  }

  submitParty() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.notify(
        'Error occured in the party details!',
        NotifyType.ERROR
      );
      return;
    }

    const partyRequest = {
      partyId: 0,
      ...this.form.value,
      stateCode: STATE_CODE.find(
        (data) => data.state === this.form.value?.state
      )?.code,
      contactNo: `${this.form.get('mobileNo')?.value}, ${
        this.form.get('landline')?.value
      }`,
    };
    delete partyRequest?.mobileNo;
    delete partyRequest?.landline;

    // TODO: API call to be added

    if (this.edit) {
      this.notificationService
        .success('Party updated successfully!')
        .afterClosed()
        .subscribe(() => this.router.navigateByUrl('/party'));
      return;
    }
    this.resetData();
    this.notificationService.success('Party added successfully!');
  }

  resetData() {
    this.form.reset();
  }
}
