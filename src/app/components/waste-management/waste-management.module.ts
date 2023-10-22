import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { WasteManagementRoutingModule } from './waste-management-routing.module';
import { CreateWasteStockComponent } from './create-waste-stock/create-waste-stock.component';

@NgModule({
  declarations: [CreateWasteStockComponent],
  imports: [
    CommonModule,
    WasteManagementRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    NgxMaskDirective,
  ],
  providers: [provideNgxMask(), NgxMaskPipe],
})
export class WasteManagementModule {}
