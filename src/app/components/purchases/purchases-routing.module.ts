import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FibrePurchaseOrderComponent } from './fibre/fibre-purchase-order/fibre-purchase-order.component';
import { FibreReceivePurchaseOrderComponent } from './fibre/fibre-receive-purchase-order/fibre-receive-purchase-order.component';
import { PendingPurchaseOrderComponent } from './fibre/pending-purchase-order/pending-purchase-order.component';
import { PurchasesComponent } from './purchases.component';

const routes: Routes = [
  {
    path: '',
    component: PurchasesComponent,
  },
  {
    path: 'fibre/fibre-new-purchase-order',
    component: FibrePurchaseOrderComponent,
  },
  {
    path: 'fibre/fibre-receive-purchase-order',
    component: FibreReceivePurchaseOrderComponent,
  },
  {
    path: 'fibre/pending-purchase-order',
    component: PendingPurchaseOrderComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchasesRoutingModule { }
