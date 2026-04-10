import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {AuthGuard} from "../../_services/auth/auth.guard";

const routes: Routes = [
  {path: '', redirectTo: 'login'},
  {path: 'login', component: LoginComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutLoginRoutingModule {
}
