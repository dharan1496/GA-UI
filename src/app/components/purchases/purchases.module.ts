import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FibrePurchaseOrderComponent } from './fibre/fibre-purchase-order/fibre-purchase-order.component';
import { FibreReceivePurchaseOrderComponent } from './fibre/fibre-receive-purchase-order/fibre-receive-purchase-order.component';
import { PurchasesRoutingModule } from './purchases-routing.module';
import { FibreSearchComponent } from './fibre/fibre-search/fibre-search.component';
import { FibreDashboardComponent } from './fibre/fibre-dashboard/fibre-dashboard.component';
import { FibreListComponent } from './fibre/fibre-master/fibre-list/fibre-list.component';
import { FibreMasterComponent } from './fibre/fibre-master/fibre-master.component';
import { FibreShadeComponent } from './fibre/fibre-master/fibre-shade/fibre-shade.component';
import { FibreStockComponent } from './fibre/fibre-stock/fibre-stock.component';
import { FibreReceiveConversionOrderComponent } from './fibre/fibre-receive-conversion-order/fibre-receive-conversion-order.component';
import { FibreReceivedOrderSearchComponent } from './fibre/fibre-received-order-search/fibre-received-order-search.component';
import { ComboBoxComponent } from 'src/app/shared/combo-box/combo-box.component';
import { FibreOpenStockComponent } from './fibre/fibre-open-stock/fibre-open-stock.component';
import { SearchOpenStockComponent } from './fibre/fibre-stock/search-open-stock/search-open-stock.component';

@NgModule({
  declarations: [
    FibrePurchaseOrderComponent,
    FibreReceivePurchaseOrderComponent,
    FibreSearchComponent,
    FibreDashboardComponent,
    FibreListComponent,
    FibreMasterComponent,
    FibreShadeComponent,
    FibreStockComponent,
    FibreReceiveConversionOrderComponent,
    FibreReceivedOrderSearchComponent,
    FibreOpenStockComponent,
    SearchOpenStockComponent,
  ],
  imports: [
    CommonModule,
    PurchasesRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    ComboBoxComponent,
  ],
})
export class PurchasesModule {}
