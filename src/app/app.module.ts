import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationComponent } from './navigation/navigation.component';
import { PrintFibrePOComponent } from './purchases/fibre/fibre-purchase-order/print-fibre-po/print-fibre-po.component';

@NgModule({
  declarations: [
    AppComponent, NavigationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    PrintFibrePOComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
