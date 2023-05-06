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
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dash/dash.component').then((m) => m.DashComponent),
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
    path: 'party',
    loadChildren: () =>
      import('./components/party/party.module').then((m) => m.PartyModule),
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
