import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FibrePurchaseOrderComponent } from './fibre/fibre-purchase-order/fibre-purchase-order.component';
import { FibreReceivePurchaseOrderComponent } from './fibre/fibre-receive-purchase-order/fibre-receive-purchase-order.component';
import { PurchasesRoutingModule } from './purchases-routing.module';
import { PurchasesComponent } from './purchases.component';
import { FibreDashboardComponent } from './fibre/fibre-dashboard/fibre-dashboard.component';


@NgModule({
  declarations: [PurchasesComponent, FibrePurchaseOrderComponent, FibreReceivePurchaseOrderComponent, FibreDashboardComponent],
  imports: [
    CommonModule,
    PurchasesRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
})
export class PurchasesModule { }
