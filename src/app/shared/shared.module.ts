import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SidebarComponent} from "./component/sidebar/sidebar.component";
import {HeaderComponent} from "./component/header/header.component";
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SelectTemplateComponent} from "./select-template/select-template.component";
import {NgSelectModule} from '@ng-select/ng-select';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {SpinnerLayoutComponent} from './component/spinner-layout/spinner-layout.component';
import {NgxSpinnerModule} from "ngx-spinner";
import {ConfirmationDialogComponent} from './component/confirmation-dialog/confirmation-dialog.component';
import {ConfirmationDialogService} from "./component/confirmation-dialog/confirmation-dialog.service";
import {DragDropDirective} from "../_directives/dragdrop.directive";
import {LinkPipe} from "../_pipe/link.pipe";
import {NgbPopoverModule} from "@ng-bootstrap/ng-bootstrap";
import {PiechartComponent} from './component/piechart/piechart.component';
import {NgxPaginationModule} from "ngx-pagination";
import {PickerModule} from "@ctrl/ngx-emoji-mart";
import {NgbTimepickerModule} from "@ng-bootstrap/ng-bootstrap";
import {NgxImageZoomModule} from "ngx-image-zoom";
import {PaginationTemplateComponent} from './pagination-template/pagination-template.component';
import {MatButtonModule} from "@angular/material/button";
import {ControlSidebarComponent} from './component/control-sidebar/control-sidebar.component';
import {SafePipe} from "../_pipe/safe.pipe";
import {MatTooltipModule} from "@angular/material/tooltip";

const COMPONENT = [
  SidebarComponent,
  HeaderComponent,
  SelectTemplateComponent,
  SpinnerLayoutComponent,
  ConfirmationDialogComponent,
  DragDropDirective,
  LinkPipe,
  SafePipe,
  PiechartComponent,
  PaginationTemplateComponent,
  ControlSidebarComponent,
];

const MODULE = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  RouterModule,
  NgSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatButtonModule,
  NgxSpinnerModule,
  NgbPopoverModule,
  NgxPaginationModule,
  PickerModule,
  NgbTimepickerModule,
  NgxImageZoomModule,
  MatTooltipModule
];

@NgModule({
  declarations: [
    ...COMPONENT,
  ],
  imports: [
    ...MODULE
  ],
  exports: [
    ...COMPONENT,
    ...MODULE,
  ],
  providers: [
    ConfirmationDialogService
  ]
})
export class SharedModule {
}
