import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component')
    .then(m => m.LoginComponent)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module')
    .then(m => m.HomeModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'purchases',
    loadChildren: () => import('./purchases/purchases.module')
    .then(m => m.PurchasesModule),
    canActivate: [AuthGuard]
   },
   {
    path: 'reset-password',
    loadChildren: () => import('./reset-password/reset-password.module')
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
