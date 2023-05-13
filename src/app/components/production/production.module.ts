import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductionRoutingModule } from './production-routing.module';
import { CreateProgramComponent } from './create-program/create-program.component';
import { ProductionMasterComponent } from './production-master/production-master.component';
import { YarnShadeComponent } from './production-master/yarn-shade/yarn-shade.component';
import { YarnBlendComponent } from './production-master/yarn-blend/yarn-blend.component';
import { YarnCountsComponent } from './production-master/yarn-counts/yarn-counts.component';
import { ProductionDashboardComponent } from './production-dashboard/production-dashboard.component';
import { MixingComponent } from './mixing/mixing.component';
import { ProductionEntryComponent } from './entry/production-entry/production-entry.component';
import { WasteEntryComponent } from './entry/waste-entry/waste-entry.component';

@NgModule({
  declarations: [
    CreateProgramComponent,
    ProductionMasterComponent,
    YarnShadeComponent,
    YarnBlendComponent,
    YarnCountsComponent,
    ProductionDashboardComponent,
    MixingComponent,
    ProductionEntryComponent,
    WasteEntryComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    ProductionRoutingModule,
  ],
})
export class ProductionModule {}
