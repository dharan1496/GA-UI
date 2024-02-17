import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateProgramComponent } from './create-program/create-program.component';
import { ProductionMasterComponent } from './production-master/production-master.component';
import { ProductionDashboardComponent } from './production-dashboard/production-dashboard.component';
import { MixingComponent } from './mixing/mixing.component';
import { ProductionEntryComponent } from './entry/production-entry/production-entry.component';
import { WasteEntryComponent } from './entry/waste-entry/waste-entry.component';
import { YarnRecoveryComponent } from './yarn-recovery/yarn-recovery.component';
import { SearchProgramComponent } from './search-program/search-program.component';
import { SearchProductionComponent } from './search-production/search-production.component';

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
    path: 'update-program',
    component: CreateProgramComponent,
  },
  {
    path: 'search-program',
    component: SearchProgramComponent,
  },
  {
    path: 'search-production',
    component: SearchProductionComponent,
  },
  {
    path: 'mixing',
    component: MixingComponent,
  },
  {
    path: 'update-mixing',
    component: MixingComponent,
  },
  {
    path: 'production-entry',
    component: ProductionEntryComponent,
  },
  {
    path: 'update-production-entry',
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
