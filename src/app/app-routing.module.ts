import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: 'fibre',
    loadChildren: () => import('./fibre/fibre.module')
    .then(m => m.FibreModule)
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
