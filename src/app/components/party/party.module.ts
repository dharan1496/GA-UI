import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AddPartyComponent } from './add-party/add-party.component';
import { PartyListComponent } from './party-list/party-list.component';
import { PartyRoutingModule } from './party-routing.module';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

@NgModule({
  declarations: [AddPartyComponent, PartyListComponent],
  imports: [
    CommonModule,
    PartyRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    NgxMaskDirective,
  ],
  providers: [provideNgxMask(), NgxMaskPipe],
})
export class PartyModule {}
