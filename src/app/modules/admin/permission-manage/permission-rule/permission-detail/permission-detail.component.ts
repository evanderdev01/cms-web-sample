import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-permission-detail',
  templateUrl: './permission-detail.component.html',
  styleUrls: ['./permission-detail.component.scss']
})
export class PermissionDetailComponent implements OnInit {
  element: any = {
    name: '',
    permissionList: [],
    functionList: [],
    jobTitleList: [],
  }

  functionList: any;
  permissionList: any;
  jobTitleList: any;
  title = 'Tạo nhóm quyền'

  constructor(private activeModal: NgbActiveModal, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
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

  decline() {
    this.activeModal.close();
  }
}
