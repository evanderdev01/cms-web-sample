import {Component, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-detail-revamp',
  templateUrl: './detail-revamp.component.html',
  styleUrls: ['./detail-revamp.component.scss']
})
export class DetailRevampComponent implements OnInit {
  obj: any;
  imageList: any;

  constructor(private activeModal: NgbActiveModal, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    if (this.obj.imgImprovedCar && this.obj.imgImprovedCar !== '') {
      this.imageList = this.obj.imgImprovedCar.split(';');
    }
  }

  openImage(idx: any, imageList: any) {
    // Image popup viewer - ImagePopupComponent removed from sample
    // In full project, this opens a modal image gallery viewer
    console.log('Open image at index:', idx);
  }

  public decline() {
    this.activeModal.close();
  }
}
