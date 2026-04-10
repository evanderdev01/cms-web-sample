import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {GuestComponent} from './guest.component';
import {LoginComponent} from './login/login.component';

const routes: Routes = [
  {
    path: '', component: GuestComponent,
    children: [
      {path: 'login', component: LoginComponent},
    ]
  }
];

@NgModule({
  declarations: [
    GuestComponent,
    LoginComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class GuestModule {
}
