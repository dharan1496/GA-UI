import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FibrePurchaseOrderComponent } from './fibre/fibre-purchase-order/fibre-purchase-order.component';
import { FibreReceivePurchaseOrderComponent } from './fibre/fibre-receive-purchase-order/fibre-receive-purchase-order.component';
import { FibreSearchComponent } from './fibre/fibre-search/fibre-search.component';
import { FibreDashboardComponent } from './fibre/fibre-dashboard/fibre-dashboard.component';
import { FibreMasterComponent } from './fibre/fibre-master/fibre-master.component';
import { FibreStockComponent } from './fibre/fibre-stock/fibre-stock.component';
import { FibreReceiveConversionOrderComponent } from './fibre/fibre-receive-conversion-order/fibre-receive-conversion-order.component';
import { FibreReceivedOrderSearchComponent } from './fibre/fibre-received-order-search/fibre-received-order-search.component';

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
    path: 'fibre/create-purchase-order',
    component: FibrePurchaseOrderComponent,
  },
  {
    path: 'fibre/update-purchase-order',
    component: FibrePurchaseOrderComponent,
  },
  {
    path: 'fibre/receive-purchase-order',
    component: FibreReceivePurchaseOrderComponent,
  },
  {
    path: 'fibre/update-received-purchase-order',
    component: FibreReceivePurchaseOrderComponent,
  },
  {
    path: 'fibre/receive-conversion-order',
    component: FibreReceiveConversionOrderComponent,
  },
  {
    path: 'fibre/search-received-po',
    component: FibreReceivedOrderSearchComponent,
  },
  {
    path: 'fibre/fibre-stock',
    component: FibreStockComponent,
  },
  {
    path: 'fibre/master',
    component: FibreMasterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchasesRoutingModule {}
