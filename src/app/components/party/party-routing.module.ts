import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartyListComponent } from './party-list/party-list.component';
import { AddPartyComponent } from './add-party/add-party.component';

const routes: Routes = [
  {
    path: '',
    component: PartyListComponent,
  },
  {
    path: 'add',
    component: AddPartyComponent,
  },
  {
    path: 'update',
    component: AddPartyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PartyRoutingModule {}
