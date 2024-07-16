import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { startWith, map, Subscription } from 'rxjs';
import { Party } from 'src/app/models/party';
import { PartyService } from 'src/app/services/party.service';
import { NotificationService } from '../notification.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-party-combo-box',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './party-combo-box.component.html',
  styleUrls: ['./party-combo-box.component.scss'],
})
export class PartyComboBoxComponent implements OnInit {
  filteredParties!: Party[];
  subscription = new Subscription();

  @Input() type = 'fibre';
  @Input() disabled = false;
  @Input() patch: any;
  @Input() required = true;
  @Input() optional = false;
  @Input() partyFormControl!: AbstractControl<any, any> | null;
  @Input() set touched(value: boolean) {
    if (value) {
      this.partyControl.markAsTouched();
    }
  }
  partyControl = new FormControl<any>('');

  constructor(
    public partyService: PartyService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.getPartyList();
    if (this.required) {
      this.partyControl.setValidators(Validators.required);
    }

    if (this.disabled) {
      this.partyControl.disable();
    }

    if (this.patch) {
      const patchValue = this.partyService.parties?.find(
        (party) => party.partyId === this.patch
      );
      patchValue && this.partyControl.patchValue(patchValue);
    }

    this.partyControl?.valueChanges
      .pipe(
        startWith(''),
        map((value) => {
          const name = typeof value === 'string' ? value : value?.['partyName'];
          return name
            ? this._filter(name as string)
            : this.partyService.parties?.slice();
        })
      )
      .subscribe((parties) => {
        this.filteredParties = parties;
      });

    this.partyControl?.valueChanges.subscribe((value: any) => {
      if (value && value instanceof Object) {
        this.setParty(value);
      }
    });

    this.partyFormControl?.valueChanges.subscribe((value) => {
      if (!value) {
        this.partyControl.reset();
      }
    });
  }

  onBlur() {
    setTimeout(() => {
      const value = this.partyControl.value;
      if (value && !(value instanceof Object)) {
        this.partyControl.reset();
        this.setParty('');
      }
      this.partyFormControl?.markAsTouched();
      this.partyControl.markAsTouched();
    }, 200);
  }

  getPartyList() {
    let observable;
    if (this.type === 'sales') {
      observable = this.partyService.getSalesParties();
    } else {
      observable = this.partyService.getFibreParties();
    }
    this.subscription.add(
      observable?.subscribe({
        next: (data) => {
          this.partyService.parties = data;
          this.filteredParties = data;
        },
        error: (error) =>
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          ),
      })
    );
  }

  setParty(party: any) {
    let value = party;
    if (party) {
      value = party.partyId;
    }
    this.partyFormControl?.setValue(value);
  }

  private _filter(name: string): Party[] {
    const filterValue = name.toLowerCase();

    return this.partyService.parties.filter((option) =>
      option.partyName.toLowerCase().includes(filterValue)
    );
  }

  displayFn(party: Party): string {
    return party && party.partyName ? party.partyName : '';
  }
}
