import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesDashboardComponent } from './sales-dashboard/sales-dashboard.component';
import { CreateSalesOrderComponent } from './create-sales-order/create-sales-order.component';
import { DeliverySalesOrderComponent } from './delivery-sales-order/delivery-sales-order.component';
import { SearchSalesOrderComponent } from './search-sales-order/search-sales-order.component';
import { DeliveriesComponent } from './deliveries/deliveries.component';
import { DeliveryInvoiceComponent } from './delivery-invoice/delivery-invoice.component';
import { ReceiveYarnReturnComponent } from './receive-yarn-return/receive-yarn-return.component';

const routes: Routes = [
  {
    path: '',
    component: SalesDashboardComponent,
  },
  {
    path: 'search-order',
    component: SearchSalesOrderComponent,
  },
  {
    path: 'new-order',
    component: CreateSalesOrderComponent,
  },
  {
    path: 'update-order',
    component: CreateSalesOrderComponent,
  },
  {
    path: 'order-delivery',
    component: DeliverySalesOrderComponent,
  },
  {
    path: 'search-deliveries',
    component: DeliveriesComponent,
  },
  {
    path: 'delivery-invoice',
    component: DeliveryInvoiceComponent,
  },
  {
    path: 'receive-yarn-return',
    component: ReceiveYarnReturnComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesRoutingModule {}
