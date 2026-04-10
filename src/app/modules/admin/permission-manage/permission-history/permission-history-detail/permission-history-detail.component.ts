import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-permission-history-detail',
  templateUrl: './permission-history-detail.component.html',
  styleUrls: ['./permission-history-detail.component.scss']
})
export class PermissionHistoryDetailComponent implements OnInit {
  obj: any

  constructor(private activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
  }

  decline() {
    this.activeModal.close();
  }
}
