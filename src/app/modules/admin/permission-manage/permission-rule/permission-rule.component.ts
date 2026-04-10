import {Component, OnInit} from '@angular/core';
import {NgxSpinnerService} from "ngx-spinner";
import {PermissionDetailComponent} from "./permission-detail/permission-detail.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-permission-rule',
  templateUrl: './permission-rule.component.html',
  styleUrls: ['./permission-rule.component.scss']
})
export class PermissionRuleComponent implements OnInit {
  dataTable: any;
  page = 1;
  itemPerPage = 10;
  totalItems: any;

  dictKeyList: any;
  columnTable: any;

  element: any = {
    textSearch: '',
    dateStart: new Date(),
    dateEnd: new Date(),
  }

  constructor(private spinner: NgxSpinnerService, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    const modalRef = this.modalService.open(PermissionDetailComponent, {size: 'lg'});
  }

  getData(str?) {

  }

  pageChangeEvent(e) {
    this.page = e;
    this.getData();
  }

  receiveSelectEvent(e: any, str: any) {
    this.spinner.show();
    switch (str) {
      default:
        this.element[str] = e;
        this.spinner.hide();
        break;
    }
  }

  eventButton(e: any) {
    if ((e.keyCode === 13 && !e.shiftKey)) {
      this.getData();
    }
  }
}
