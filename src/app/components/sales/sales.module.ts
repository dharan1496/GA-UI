import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DecimalDirective } from 'src/app/shared/decimalNumberDirective';
import { SalesRoutingModule } from './sales-routing.module';
import { CreateSalesOrderComponent } from './create-sales-order/create-sales-order.component';
import { SalesDashboardComponent } from './sales-dashboard/sales-dashboard.component';
import { DeliverySalesOrderComponent } from './delivery-sales-order/delivery-sales-order.component';
import { SearchSalesOrderComponent } from './search-sales-order/search-sales-order.component';

@NgModule({
  declarations: [
    CreateSalesOrderComponent,
    SalesDashboardComponent,
    DeliverySalesOrderComponent,
    SearchSalesOrderComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    DecimalDirective,
    SalesRoutingModule,
  ],
})
export class SalesModule {}
