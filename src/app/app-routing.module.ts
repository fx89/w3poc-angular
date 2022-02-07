import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersPageComponent } from './pages/customers-page/customers-page.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { LoginHandlerComponent } from './w3poc-core/login-handler/login-handler.component';

const routes: Routes = [
    {path : '', component : MainPageComponent},
    {path : 'auth-complete', component : LoginHandlerComponent},
    {path : 'customers', component : CustomersPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
