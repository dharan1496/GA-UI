import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FibrePurchaseOrderComponent } from './fibre-purchase-order.component';

const routes: Routes = [
  {
    path: '',
    component: FibrePurchaseOrderComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FibrePurchaseOrderRoutingModule { }
