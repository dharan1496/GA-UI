import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesDashboardComponent } from './sales-dashboard/sales-dashboard.component';
import { CreateSalesOrderComponent } from './create-sales-order/create-sales-order.component';
import { SalesMasterComponent } from './sales-master/sales-master.component';
import { DeliverySalesOrderComponent } from './delivery-sales-order/delivery-sales-order.component';

const routes: Routes = [
  {
    path: '',
    component: SalesDashboardComponent,
  },
  {
    path: 'new-order',
    component: CreateSalesOrderComponent,
  },
  {
    path: 'order-delivery',
    component: DeliverySalesOrderComponent,
  },
  {
    path: 'master',
    component: SalesMasterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesRoutingModule {}
