import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {HealthComponent} from './health.component';

const routes: Routes = [
  {path: '', component: HealthComponent}
];

@NgModule({
  declarations: [
    HealthComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class HealthModule {
}
