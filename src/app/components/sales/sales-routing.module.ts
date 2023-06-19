import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesDashboardComponent } from './sales-dashboard/sales-dashboard.component';
import { CreateSalesOrderComponent } from './create-sales-order/create-sales-order.component';
import { DeliverySalesOrderComponent } from './delivery-sales-order/delivery-sales-order.component';
import { SearchSalesOrderComponent } from './search-sales-order/search-sales-order.component';
import { DeliveriesComponent } from './deliveries/deliveries.component';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesRoutingModule {}
