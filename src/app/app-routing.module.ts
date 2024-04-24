import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'purchases',
    loadChildren: () =>
      import('./components/purchases/purchases.module').then(
        (m) => m.PurchasesModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'production',
    loadChildren: () =>
      import('./components/production/production.module').then(
        (m) => m.ProductionModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'sales',
    loadChildren: () =>
      import('./components/sales/sales.module').then((m) => m.SalesModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'party',
    loadChildren: () =>
      import('./components/party/party.module').then((m) => m.PartyModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'waste',
    loadChildren: () =>
      import('./components/waste-management/waste-management.module').then(
        (m) => m.WasteManagementModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'employee',
    loadChildren: () =>
      import('./components/employee/employee.module').then(
        (m) => m.EmployeeModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'payroll',
    loadChildren: () =>
      import('./components/payroll/payroll.module').then(
        (m) => m.PayrollModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'change-password',
    loadChildren: () =>
      import('./components/change-password/change-password.module').then(
        (m) => m.ChangePasswordModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'reset-password',
    loadChildren: () =>
      import('./components/reset-password/reset-password.module').then(
        (m) => m.ResetPasswordModule
      ),
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
