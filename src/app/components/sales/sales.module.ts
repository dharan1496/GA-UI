import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DecimalDirective } from 'src/app/shared/decimalNumberDirective';
import { SalesRoutingModule } from './sales-routing.module';
import { CreateSalesOrderComponent } from './create-sales-order/create-sales-order.component';
import { SalesDashboardComponent } from './sales-dashboard/sales-dashboard.component';
import { DeliverySalesOrderComponent } from './delivery-sales-order/delivery-sales-order.component';
import { SearchSalesOrderComponent } from './search-sales-order/search-sales-order.component';
import { DeliveriesComponent } from './deliveries/deliveries.component';
import { DeliveryInvoiceComponent } from './delivery-invoice/delivery-invoice.component';
import { ReceiveYarnReturnComponent } from './receive-yarn-return/receive-yarn-return.component';
import { WasteOrderDeliveryComponent } from './waste-order-delivery/waste-order-delivery.component';
import { SearchWasteDeliveryComponent } from './search-waste-delivery/search-waste-delivery.component';
import { PartyComboBoxComponent } from 'src/app/shared/party-combo-box/party-combo-box.component';

@NgModule({
  declarations: [
    CreateSalesOrderComponent,
    SalesDashboardComponent,
    DeliverySalesOrderComponent,
    SearchSalesOrderComponent,
    DeliveriesComponent,
    DeliveryInvoiceComponent,
    ReceiveYarnReturnComponent,
    WasteOrderDeliveryComponent,
    SearchWasteDeliveryComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    DecimalDirective,
    SalesRoutingModule,
    FormsModule,
    PartyComboBoxComponent,
  ],
})
export class SalesModule {}
