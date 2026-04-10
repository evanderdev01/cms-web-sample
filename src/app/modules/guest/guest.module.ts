import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './login/login.component';
import {LayoutLoginRoutingModule} from './guest-routing.module';

@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    CommonModule,
    LayoutLoginRoutingModule
  ]
})
export class GuestModule {
}
