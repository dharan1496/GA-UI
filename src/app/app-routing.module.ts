import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: 'fibre-new-purchase-order',
    loadChildren: () => import('./fibre/fibre-purchase-order/fibre-purchase-order.module')
    .then(m => m.FibrePurchaseOrderModule)
   }
   
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
