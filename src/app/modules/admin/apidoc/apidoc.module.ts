import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApidocRoutingModule } from './apidoc-routing.module';
import { ApidocComponent } from './apidoc.component';


@NgModule({
  declarations: [
    ApidocComponent
  ],
  imports: [
    CommonModule,
    ApidocRoutingModule
  ]
})
export class ApidocModule { }
