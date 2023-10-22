import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateWasteStockComponent } from './create-waste-stock/create-waste-stock.component';

const routes: Routes = [
  {
    path: '',
    component: CreateWasteStockComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WasteManagementRoutingModule {}
