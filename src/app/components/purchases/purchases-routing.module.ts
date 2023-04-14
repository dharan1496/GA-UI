import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FibrePurchaseOrderComponent } from './fibre/fibre-purchase-order/fibre-purchase-order.component';
import { FibreReceivePurchaseOrderComponent } from './fibre/fibre-receive-purchase-order/fibre-receive-purchase-order.component';
import { FibreSearchComponent } from './fibre/fibre-search/fibre-search.component';
import { FibreDashboardComponent } from './fibre/fibre-dashboard/fibre-dashboard.component';
import { FibreListComponent } from './fibre/fibre-list/fibre-list.component';

const routes: Routes = [
  {
    path: 'fibre',
    component: FibreDashboardComponent,
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
  {
    path: 'fibre/fibre-list',
    component: FibreListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchasesRoutingModule {}
