import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FibrePurchaseOrderComponent } from './fibre-purchase-order.component';
import { MaterialModule } from 'src/app/material.module';
import { FibrePurchaseOrderRoutingModule } from './fibre-purchase-order-routing.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [FibrePurchaseOrderComponent],
  imports: [
    CommonModule,
    FibrePurchaseOrderRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
  ]
})
export class FibrePurchaseOrderModule { }
