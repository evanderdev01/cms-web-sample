import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {MediaService} from "../../../../_services/data/media.service";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-update-library',
  templateUrl: './update-library.component.html',
  styleUrls: ['./update-library.component.scss']
})
export class UpdateLibraryComponent implements OnInit {
  obj: any;
  mail: any;
  @Output() statusEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(private activeModal: NgbActiveModal, private mediaService: MediaService, private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    if (this.obj) {
      this.mail = this.obj.authEmail;
    }
  }

  update() {
    const content = {
      idMeeting: this.obj.idMeeting,
      authEmail: this.mail,
      active: 1
    };
    this.spinner.show();
    this.mediaService.updateLibraryMeeting(content).subscribe((res) => {
      this.spinner.hide();
      if (res && res.statusCode === 1) {
        Swal.fire('Thành công', res.message, 'success').then(() => this.statusEvent.emit({status: 1}));
        this.activeModal.close();
      } else {
        Swal.fire('Thông báo', res.message, 'error');
      }
    });
  }

  close() {
    this.activeModal.close();
  }
}
