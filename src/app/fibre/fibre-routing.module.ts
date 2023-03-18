import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FibrePurchaseOrderComponent } from './fibre-purchase-order/fibre-purchase-order.component';

const routes: Routes = [
  {
    path: 'fibre-new-purchase-order',
    component: FibrePurchaseOrderComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FibreRoutingModule { }
