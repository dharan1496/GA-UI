import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateProgramComponent } from './create-program/create-program.component';
import { ProductionMasterComponent } from './production-master/production-master.component';
import { ProductionDashboardComponent } from './production-dashboard/production-dashboard.component';
import { MixingComponent } from './mixing/mixing.component';

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
    path: 'master',
    component: ProductionMasterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductionRoutingModule {}
