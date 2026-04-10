import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-detail-library',
  templateUrl: './detail-library.component.html',
  styleUrls: ['./detail-library.component.scss']
})
export class DetailLibraryComponent implements OnInit {
  linkLibrary: any;
  type: any;

  constructor(private activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
  }

  close() {
    this.activeModal.close();
  }
}
