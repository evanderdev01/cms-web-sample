import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LibraryRoutingModule} from './library-routing.module';
import {LibraryComponent} from './library.component';
import {SharedModule} from "../../../shared/shared.module";
import {DetailLibraryComponent} from './detail-library/detail-library.component';
import {AddLibraryComponent} from './add-library/add-library.component';
import {UpdateLibraryComponent} from './update-library/update-library.component';


@NgModule({
  declarations: [
    LibraryComponent,
    DetailLibraryComponent,
    AddLibraryComponent,
    UpdateLibraryComponent
  ],
  imports: [
    CommonModule,
    LibraryRoutingModule,
    SharedModule
  ]
})
export class LibraryModule {
}
