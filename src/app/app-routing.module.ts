import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module')
    .then(m => m.HomeModule)
  },
  {
    path: 'purchases',
    loadChildren: () => import('./purchases/purchases.module')
    .then(m => m.PurchasesModule)
   },
   {
    path: 'reset-password',
    loadChildren: () => import('./reset-password/reset-password.module')
    .then(m => m.ResetPasswordModule)
   },
   {
    path: '**',
    redirectTo: '/'
   }
   
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
