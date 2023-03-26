import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component')
    .then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component')
    .then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'purchases',
    loadChildren: () => import('./components/purchases/purchases.module')
    .then(m => m.PurchasesModule),
    canActivate: [AuthGuard]
   },
   {
    path: 'reset-password',
    loadChildren: () => import('./components/reset-password/reset-password.module')
    .then(m => m.ResetPasswordModule),
    canActivate: [AuthGuard]
   },
   {
    path: '**',
    redirectTo: 'login'
   }
   
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
