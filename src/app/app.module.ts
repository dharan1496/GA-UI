import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthGuard } from './shared/auth.guard';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { PrintFibrePOComponent } from './components/purchases/fibre/fibre-purchase-order/print-fibre-po/print-fibre-po.component';
import { ToolBarComponent } from './components/tool-bar/tool-bar.component';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { PrintDeliveryReceiptComponent } from './components/sales/print-delivery-receipt/print-delivery-receipt.component';
import { PrintDeliveryInvoiceComponent } from './components/sales/delivery-invoice/print-delivery-invoice/print-delivery-invoice.component';
import { PrintFibreStockComponent } from './components/purchases/fibre/fibre-stock/print-fibre-stock/print-fibre-stock.component';
import { PrintRecoveryDetailsComponent } from './components/production/yarn-recovery/print-recovery-details/print-recovery-details.component';
import { PrintSalarySummaryComponent } from './components/payroll/salary-summary/print-salary-summary/print-salary-summary.component';

@NgModule({
  declarations: [AppComponent, SideMenuComponent, ToolBarComponent],
  providers: [AuthGuard, DatePipe, DecimalPipe, CurrencyPipe],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    PrintFibrePOComponent,
    PrintDeliveryReceiptComponent,
    LoginComponent,
    HttpClientModule,
    NgIdleKeepaliveModule.forRoot(),
    PrintDeliveryInvoiceComponent,
    PrintFibreStockComponent,
    PrintRecoveryDetailsComponent,
    PrintSalarySummaryComponent,
  ],
})
export class AppModule {}
