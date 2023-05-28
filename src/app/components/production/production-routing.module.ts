import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateProgramComponent } from './create-program/create-program.component';
import { ProductionMasterComponent } from './production-master/production-master.component';
import { ProductionDashboardComponent } from './production-dashboard/production-dashboard.component';
import { MixingComponent } from './mixing/mixing.component';
import { ProductionEntryComponent } from './entry/production-entry/production-entry.component';
import { WasteEntryComponent } from './entry/waste-entry/waste-entry.component';
import { YarnRecoveryComponent } from './yarn-recovery/yarn-recovery.component';

const routes: Routes = [
  {
    path: '',
    component: ProductionDashboardComponent,
  },
  {
    path: 'create-program',
    component: CreateProgramComponent,
  },
  {
    path: 'mixing',
    component: MixingComponent,
  },
  {
    path: 'production-entry',
    component: ProductionEntryComponent,
  },
  {
    path: 'waste-entry',
    component: WasteEntryComponent,
  },
  {
    path: 'yarn-recovery',
    component: YarnRecoveryComponent,
  },
  {
    path: 'master',
    component: ProductionMasterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductionRoutingModule {}
