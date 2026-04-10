import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LibraryComponent} from "./library.component";
import {DetailLibraryComponent} from "./detail-library/detail-library.component";

const routes: Routes = [
  {
    path: '', component: LibraryComponent,
    children: [
      {path: 'meeting/:document_no', component: DetailLibraryComponent},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LibraryRoutingModule {
}
