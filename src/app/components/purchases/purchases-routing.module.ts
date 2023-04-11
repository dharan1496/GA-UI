import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FibrePurchaseOrderComponent } from './fibre/fibre-purchase-order/fibre-purchase-order.component';
import { FibreReceivePurchaseOrderComponent } from './fibre/fibre-receive-purchase-order/fibre-receive-purchase-order.component';
import { PurchasesComponent } from './purchases.component';
import { FibreSearchComponent } from './fibre/fibre-search/fibre-search.component';

const routes: Routes = [
  {
    path: '',
    component: PurchasesComponent,
  },
  {
    path: 'fibre/search',
    component: FibreSearchComponent,
  },
  {
    path: 'fibre/new-purchase-order',
    component: FibrePurchaseOrderComponent,
  },
  {
    path: 'fibre/receive-purchase-order',
    component: FibreReceivePurchaseOrderComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchasesRoutingModule {}
