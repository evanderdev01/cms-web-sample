import {Component, OnInit} from '@angular/core';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from "@angular/material-moment-adapter";
import {GeneralService} from "../../../_services/data/general.service";
import {MediaService} from "../../../_services/data/media.service";
import Swal from "sweetalert2";
import {NgxSpinnerService} from "ngx-spinner";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AddLibraryComponent} from "./add-library/add-library.component";
import {DetailLibraryComponent} from "./detail-library/detail-library.component";
import {ConfirmationDialogService} from "../../../shared/component/confirmation-dialog/confirmation-dialog.service";
import {UpdateLibraryComponent} from "./update-library/update-library.component";
import {ActivityLogService} from "../../../_services/data/activity-log.service";

const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'en-US'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT},
  ],
})
export class LibraryComponent implements OnInit {
  nameDoc: any;
  typeList = [
    {name: 'Process', value: 'PROCESS'},
    {name: 'Regulation', value: 'REGULATION'},
    {name: 'Meeting Minutes', value: 'MEETING_MINUTES'},
    {name: 'Guide', value: 'GUIDE'},
    {name: 'Policy', value: 'POLICY'},
  ];
  typeSelect = this.typeList[0].value;
  element = {
    name_meeting: '',
    child_depart: '',
    date_meeting: ''
  };
  dataTable: any;
  page1 = 1;
  page2 = 1;
  itemPerPage1 = 10;
  itemPerPage2 = 10;

  constructor(private generalService: GeneralService, private spinner: NgxSpinnerService, private mediaService: MediaService,
              private modalService: NgbModal, private confirmationDialogService: ConfirmationDialogService, private logService: ActivityLogService) {
  }

  ngOnInit(): void {
  }

  receiveSelectEvent(e: any) {
    this.typeSelect = e;
    this.dataTable = null;
  }

  getLibrary() {
    let content: any;
    if (this.typeSelect === 'MEETING_MINUTES') {
      content = {
        childDepart: this.element.child_depart ? this.element.child_depart : '',
        dateMeeting: this.element.date_meeting ? this.generalService.convertMatDateToDDMMYYY(this.element.date_meeting) : '',
        nameMeeting: this.element.name_meeting ? this.element.name_meeting : '',
      };
      this.spinner.show();
      this.mediaService.getMeeting(content).subscribe((res) => {
        this.spinner.hide();
        if (res && res.statusCode === 1) {
          this.page1 = 1;
          this.dataTable = res.data;
          if (this.dataTable.length === 0) {
            Swal.fire('Notice', 'No data found', 'warning');
          }
        } else {
          this.dataTable = null;
          Swal.fire('Notice', res.message, 'warning');
        }
      });
    } else {
      content = {
        typeDoc: this.typeSelect,
        nameDoc: this.nameDoc
      };
      this.spinner.show();
      this.mediaService.getLibrary(content).subscribe((res) => {
        this.spinner.hide();
        if (res && res.statusCode === 1) {
          this.page2 = 1;
          this.dataTable = res.data;
          if (this.dataTable.length === 0) {
            Swal.fire('Notice', 'No data found', 'warning');
          }
        } else {
          this.dataTable = null;
          Swal.fire('Notice', res.message, 'warning');
        }
      });
    }
  }

  deleteLibrary(id, str?) {
    this.confirmationDialogService.confirm('Confirm', 'Confirm delete this document?').then((confirmed: any) => {
      if (confirmed === true) {
        if (str === 'meeting') {
          const content = {
            idMeeting: id,
            authEmail: '',
            active: 0
          };
          this.spinner.show();
          this.mediaService.updateLibraryMeeting(content).subscribe((res) => {
            this.spinner.hide();
            if (res && res.statusCode === 1) {
              Swal.fire('Success', res.message, 'success').then(() => this.getLibrary());
            } else {
              Swal.fire('Notice', res.message, 'warning');
            }
          });
        } else {
          const content = {
            id: id,
            active: 0
          };
          this.spinner.show();
          this.mediaService.updateLibrary(content).subscribe((res) => {
            this.spinner.hide();
            if (res && res.statusCode === 1) {
              Swal.fire('Success', res.message, 'success').then(() => this.getLibrary());
            } else {
              Swal.fire('Notice', res.message, 'warning');
            }
          });
        }
      }
    });
  }

  openAdd() {
    const modalRef = this.modalService.open(AddLibraryComponent, {size: 'lg', windowClass: 'add-library'});
    modalRef.componentInstance.statusEvent.subscribe((res) => {
      if (res && res.status === 1) {
        this.typeSelect = res.typeSelect;
        this.getLibrary();
      }
    });
  }

  openDetail(url, type): any {
    this.spinner.show();
    this.mediaService.downloadLibrary(url).subscribe((data) => {
      this.spinner.hide();
      const downloadURL = window.URL.createObjectURL(data);
      const modalRef = this.modalService.open(DetailLibraryComponent, {size: 'xl'});
      modalRef.componentInstance.linkLibrary = downloadURL;
      modalRef.componentInstance.type = type;
    });
  }

  openUpdate(obj): any {
    const modalRef = this.modalService.open(UpdateLibraryComponent, {size: 'lg'});
    modalRef.componentInstance.obj = obj;
    modalRef.componentInstance.statusEvent.subscribe((res) => {
      if (res && res.status === 1) {
        this.getLibrary();
      }
    });
  }

  downloadLibrary(url, fileName) {
    this.mediaService.downloadLibrary(url).subscribe((data) => {
      const downloadURL = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = fileName;
      link.click();
    });
  }

  openNote(note, title) {
    const a = note.split(';');
    let list = '';
    a.forEach((i) => {
      list = list + `<li style="line-height: 2.5rem">${i}</li>`;
    });
    list = `<ul style="text-align: left">` + list + `</ul>`;
    Swal.fire({title: title, html: list, width: '50vw'});
  }
}
