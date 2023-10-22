import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateWasteStockComponent } from './create-waste-stock/create-waste-stock.component';
import { WasteMasterComponent } from './waste-master/waste-master.component';

const routes: Routes = [
  {
    path: '',
    component: CreateWasteStockComponent,
  },
  {
    path: 'master',
    component: WasteMasterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WasteManagementRoutingModule {}
