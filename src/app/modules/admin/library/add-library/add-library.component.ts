import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {MediaService} from "../../../../_services/data/media.service";
import Swal from "sweetalert2";
import {NgxSpinnerService} from "ngx-spinner";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from "@angular/material-moment-adapter";
import {GeneralService} from "../../../../_services/data/general.service";
import {AuthService} from "../../../../_services/auth/auth.service";
import {ActivityLogService} from "../../../../_services/data/activity-log.service";

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
  selector: 'app-add-library',
  templateUrl: './add-library.component.html',
  styleUrls: ['./add-library.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'vi-VN'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT},
  ],
})

export class AddLibraryComponent implements OnInit {
  typeFile = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/msword, application/pdf';
  typeList = [
    {name: 'Quy trình', value: 'PROCESS'},
    {name: 'Quy định', value: 'REGULATION'},
    {name: 'Biên bản họp', value: 'MEETING_MINUTES'},
    {name: 'Tài liệu hướng dẫn', value: 'GUIDE_DOCUMENT'},
    {name: 'Chính sách', value: 'POLICY'},
  ];
  branchList = [
    {label: 'TIN', value: 'TIN'},
    {label: 'PNC', value: 'PNC'},
    {label: 'Toàn quốc', value: 'TOAN_QUOC'},
  ]

  elementMeeting = {
    childDepart: [],
    authEmail: [],
    nameMeeting: '',
    dateMeeting: '',
  };

  elementLibrary = {
    nameDocument: '',
    branch: this.branchList[0].value
  }

  listFiles: any;
  parentDepartList: any;
  childDepartRight: any;
  childDepartList: any;
  empEmailList: any;

  typeSelect = this.typeList[0].value;
  parentDepartSelect = [];

  @Output() statusEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(private activeModal: NgbActiveModal, private mediaService: MediaService, private authService: AuthService,
              private spinner: NgxSpinnerService, private generalService: GeneralService, private logService: ActivityLogService) {
  }

  ngOnInit() {
    this.getSelectChildDepart();
  }

  getSelectChildDepart() {
    const res = this.generalService.getSelectChildDepart() || null;
    if (res) {
      this.parentDepartList = res.parentDepartList;
      this.childDepartRight = res.childDepartList;
      if (this.parentDepartList.length === 1) {
        this.receiveSelectEvent([this.parentDepartList[0].parentDepart], 'parentDepart');
      }
    }
    this.authService.changeEmitted$.subscribe((res) => {
      if (res === 'user_info') {
        this.getSelectChildDepart();
      }
    });
  }

  receiveFile(e) {
    const file = e.target.files[0];
    this.listFiles = [];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (evt: any) => {
        this.listFiles.push({
          dataURI: reader.result,
          fileType: file.type,
          fileName: file.name.split('.')[0],
        });
      };
    }
  }

  receiveSelectEvent(e: any, str?: any) {
    if (str) {
      this.spinner.show();
      switch (str) {
        case 'parentDepart':
          this.parentDepartSelect = e;
          this.childDepartList = [];
          this.elementMeeting.childDepart = [];
          this.empEmailList = [];
          this.elementMeeting.authEmail = [];
          if (Array.isArray(e) && e.length > 0) {
            for (let i = 0; i < e.length; i++) {
              this.childDepartList = this.childDepartList.concat(this.childDepartRight.filter((item) => item.parentDepart.toString() === e[i].toString()));
            }
            if (this.parentDepartList.length === 1 && this.childDepartList.length === 1) {
              this.receiveSelectEvent([this.childDepartList[0].childDepart], 'childDepart');
            }
          }
          this.spinner.hide();
          break;
        case 'childDepart':
          this.elementMeeting.childDepart = e;
          this.empEmailList = [];
          this.elementMeeting.authEmail = [];
          if (Array.isArray(e) && e.length > 0) {
            this.mediaService.getEmailListFollowChildDepart(this.elementMeeting.childDepart).subscribe((res) => {
              this.spinner.hide();
              this.empEmailList = res.data.listEmail;
            });
          } else {
            this.spinner.hide();
          }
          break;
        case 'branch':
          this.spinner.hide();
          this.elementLibrary[str] = e;
          break;
        default:
          this.spinner.hide();
          this.elementMeeting[str] = e;
          break;
      }
    } else {
      this.typeSelect = e;
    }
  }

  public addLibrary() {
    if (!this.listFiles || (this.listFiles && this.listFiles.length === 0)) {
      Swal.fire('Thông báo', 'Vui lòng không để trống!', 'warning');
    } else {
      if (this.listFiles[0].fileType !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        && this.listFiles[0].fileType !== 'application/msword' && this.listFiles[0].fileType !== 'application/pdf') {
        Swal.fire('Thông báo', 'Vui lòng kiểm tra lại định dạng File', 'warning');
      } else {
        if (this.typeSelect !== 'MEETING_MINUTES') {
          let isEmpty = false;
          Object.keys(this.elementLibrary).forEach((key) => {
            if (this.elementLibrary[key].toString() === '') {
              isEmpty = true;
            }
          })
          if (isEmpty) {
            Swal.fire('Thông báo', 'Vui lòng không để trống!', 'warning');
          } else {
            this.spinner.show();
            const formData = this.mediaService.submitData(this.listFiles, this.typeSelect, this.elementLibrary);
            this.mediaService.addLibrary(formData).subscribe((res) => {
              this.spinner.hide();
              if (res && res.statusCode === 1) {
                Swal.fire('Thành công', res.message, 'success').then(() => this.statusEvent.emit({
                  typeSelect: this.typeSelect,
                  status: 1
                }));
                this.activeModal.close();
              } else {
                Swal.fire('Thông báo', res.message, 'warning');
              }
            });
          }

        } else {
          let isEmpty = false;
          if (this.elementMeeting.dateMeeting) {
            this.elementMeeting.dateMeeting = this.generalService.convertMatDateToDDMMYYY(this.elementMeeting.dateMeeting);
          }
          Object.keys(this.elementMeeting).forEach((key) => {
            if (this.elementMeeting[key].toString() === '') {
              isEmpty = true;
            }
          })
          if (isEmpty) {
            Swal.fire('Thông báo', 'Vui lòng không để trống!', 'warning');
          } else {
            this.spinner.show();
            const formData = this.mediaService.submitData(this.listFiles, this.typeSelect, this.elementMeeting);
            this.mediaService.addMeeting(formData).subscribe((res) => {
              this.spinner.hide();
              if (res && res.statusCode === 1) {
                Swal.fire('Thành công', res.message, 'success').then(() => this.statusEvent.emit({status: 1}));
                this.activeModal.close();
              } else {
                Swal.fire('Thông báo', res.message, 'warning');
              }
            });
          }
        }
      }
    }
  }

  public decline() {
    this.activeModal.close();
  }
}
