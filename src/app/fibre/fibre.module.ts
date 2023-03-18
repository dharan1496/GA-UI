import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FibrePurchaseOrderComponent } from './fibre-purchase-order/fibre-purchase-order.component';
import { FibreRoutingModule } from './fibre-routing.module';
import { FibreReceivePurchaseOrderComponent } from './fibre-receive-purchase-order/fibre-receive-purchase-order.component';


@NgModule({
  declarations: [FibrePurchaseOrderComponent, FibreReceivePurchaseOrderComponent],
  imports: [
    CommonModule,
    FibreRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
  ]
})
export class FibreModule { }
