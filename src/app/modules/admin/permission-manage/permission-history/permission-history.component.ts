import {Component, OnInit} from '@angular/core';
import {GeneralService} from "../../../../_services/data/general.service";
import {AuthService} from "../../../../_services/auth/auth.service";
import {NgxSpinnerService} from "ngx-spinner";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from "@angular/material-moment-adapter";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {PermissionHistoryDetailComponent} from "./permission-history-detail/permission-history-detail.component";
import Swal from "sweetalert2";
import {ProfileService} from "../../../../_services/data/profile.service";
import {ConfirmationDialogService} from "../../../../shared/component/confirmation-dialog/confirmation-dialog.service";

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
  selector: 'app-permission-history',
  templateUrl: './permission-history.component.html',
  styleUrls: ['./permission-history.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'vi-VN'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT},
  ]
})
export class PermissionHistoryComponent implements OnInit {
  allParentDepartList: any;
  parentDepartList: any;
  allUnitList: any;
  unitList: any;
  allChildDepartList: any;
  childDepartList: any;
  actionList = [
    {label: 'Cấp mới', value: 'assign'},
    {label: 'Thu hồi', value: 'remove'},
    {label: 'Cập nhật phạm vi sử dụng data', value: 'edit_child_depart_scope'}
  ];

  durationMonth = new Date().getMonth() + 1;
  durationYear = new Date().getFullYear();
  maxDate: any = new Date();
  element: any = {
    parentDepart: [],
    unit: [],
    childDepart: [],
    actionList: [],
    dateFrom: new Date(this.durationYear, this.durationMonth - 1, 1),
    dateTo: new Date(),
    textSearch: '',
    typeSearch: 'depart'
  };

  isEmptyPerson = false;
  isImport = false;
  isEdit = false;

  dataTablePerson: any;
  pagePerson = 1;
  itemPerPagePerson = 10;
  totalItemsPerson: any;

  dataTableDepart: any;
  pageDepart = 1;
  itemPerPageDepart = 10;
  totalItemsDepart: any;

  columnTable: any;

  constructor(private generalService: GeneralService, private authService: AuthService, private spinner: NgxSpinnerService,
              private modalService: NgbModal, private profileService: ProfileService,
              private confirmationDialogService: ConfirmationDialogService) {
  }

  ngOnInit(): void {
    this.getSelectChildDepart();
    this.getData();
  }

  getSelectChildDepart() {
    const res = this.generalService.getSelectChildDepart() || null;
    if (res) {
      this.allParentDepartList = res.parentDepartList
      this.parentDepartList = res.parentDepartList;
      this.allUnitList = res.unitList;
      this.unitList = res.unitList;
      this.allChildDepartList = res.childDepartList;
      this.childDepartList = res.childDepartList;
      this.isEdit = res.rightEdit;
      this.isImport = res.rightImport;
      if (this.childDepartList.length === 1) {
        this.receiveSelectEvent([this.childDepartList[0].childDepart], 'childDepart');
      }
    }
    this.authService.changeEmitted$.subscribe((res) => {
      if (res === 'user_info') {
        this.getSelectChildDepart();
      }
    });
  }

  getData(str?, page?) {
    let content;
    let p;
    if (page) {
      p = page;
    } else {
      p = 1;
    }
    if (!this.element.dateFrom || !this.element.dateTo) {
      Swal.fire('Thông báo', 'Vui lòng chọn thời gian', 'warning');
    } else {
      let itemPerPage: any;
      if (this.element.typeSearch === 'depart') {
        itemPerPage = this.itemPerPageDepart;
        let childDepart: any;
        if (this.element.childDepart.length === 0) {
          childDepart = this.childDepartList.map(i => i.childDepart);
        } else {
          childDepart = this.element.childDepart;
        }
        content = {
          childDepart: childDepart,
          actionList: this.element.actionList,
          dateFrom: this.generalService.convertMatDateToDDMMYYY(this.element.dateFrom),
          dateTo: this.generalService.convertMatDateToDDMMYYY(this.element.dateTo),
        }
      } else if (this.element.typeSearch === 'person') {
        itemPerPage = this.itemPerPagePerson;
        if (this.element.textSearch === '') {
          this.isEmptyPerson = true;
        } else {
          const reg = new RegExp('^\\d+$', 'g');
          if (reg.test(this.element.textSearch.trim().toString())) {
            content = {
              code: this.element.textSearch.trim(),
              actionList: this.element.actionList,
              dateFrom: this.generalService.convertMatDateToDDMMYYY(this.element.dateFrom),
              dateTo: this.generalService.convertMatDateToDDMMYYY(this.element.dateTo),
            }
          } else if (this.element.textSearch.trim().includes('@')) {
            content = {
              email: this.element.textSearch.trim(),
              actionList: this.element.actionList,
              dateFrom: this.generalService.convertMatDateToDDMMYYY(this.element.dateFrom),
              dateTo: this.generalService.convertMatDateToDDMMYYY(this.element.dateTo),
            }
          } else {
            Swal.fire('Thông báo', 'Mã nhân viên hoặc Email không hợp lệ', 'warning')
          }
        }
      }
      if (content) {
        if (str) {
          this.confirmationDialogService.confirm('Xác nhận', 'Xác nhận lưu file?').then((confirmed: any) => {
            if (confirmed === true) {
              this.spinner.show();
              Object.assign(content, {isExport: true});
              this.profileService.getPermissionHistory(content).subscribe((res) => {
                this.spinner.hide();
                if (res && res.statusCode === 1) {
                  if (res.data.length === 0) {
                    Swal.fire('Thông báo', 'Không có dữ liệu', 'warning');
                  } else {
                    this.generalService.storeFileNoQuestion({data: res.data}, 'Bao_cao_lich_su_phan_quyen');
                  }
                } else {
                  Swal.fire('Thông báo', res.message, 'warning');
                }
              });
            }
          });
        } else {
          this.spinner.show();
          this.profileService.getPermissionHistory(content, p, itemPerPage).subscribe(res => {
            this.spinner.hide();
            if (res && res.statusCode === 1) {
              if (res.data.listData.length === 0) {
                if (this.element.typeSearch === 'depart') {
                  this.dataTableDepart = [];
                } else if (this.element.typeSearch === 'person') {
                  this.dataTablePerson = [];
                }
                Swal.fire('Thông báo', 'Không có dữ liệu', 'warning');
              } else {
                if (this.element.typeSearch === 'depart') {
                  this.pageDepart = p;
                  this.dataTableDepart = res.data.listData;
                  this.totalItemsDepart = res.data.numberRow;
                } else if (this.element.typeSearch === 'person') {
                  this.pagePerson = p;
                  this.dataTablePerson = res.data.listData;
                  this.totalItemsPerson = res.data.numberRow;
                }
                this.columnTable = Object.keys(res.data.listData[0]);
              }
            } else {
              if (this.element.typeSearch === 'depart') {
                this.dataTableDepart = null;
              } else if (this.element.typeSearch === 'person') {
                this.dataTablePerson = null;
              }
              Swal.fire('Thông báo', res.message, 'warning');
            }
          }, error => {
            if (this.element.typeSearch === 'depart') {
              this.dataTableDepart = null;
            } else if (this.element.typeSearch === 'person') {
              this.dataTablePerson = null;
            }
          });
        }
      }
    }
  }

  getDetailHistory(obj) {
    this.spinner.show();
    this.profileService.getDetailPermissionHistory({id: obj['ID']}).subscribe(res => {
      this.spinner.hide();
      if (res && res.statusCode === 1) {
        const modalRef = this.modalService.open(PermissionHistoryDetailComponent, {size: 'lg'});
        modalRef.componentInstance.obj = res.data;
      } else {
        Swal.fire('Thông báo', res.message, 'warning');
      }
    })
  }

  pageChangeEvent(e) {
    if (this.element.typeSearch === 'depart') {
      this.pageDepart = e;
      this.getData(false, this.pageDepart);
    } else if (this.element.typeSearch === 'person') {
      this.pagePerson = e;
      this.getData(false, this.pagePerson);
    }
  }

  receiveSelectEvent(e: any, str: any) {
    this.spinner.show();
    switch (str) {
      case 'parentDepart':
        this.element.unit = [];
        this.element.childDepart = [];
        this.element.parentDepart = e;
        this.unitList = [];
        this.childDepartList = [];
        if (Array.isArray(e) && e.length > 0) {
          for (let i = 0; i < e.length; i++) {
            this.unitList = this.unitList.concat(this.allUnitList.filter((item) => item.parentDepart === e[i]));
            this.childDepartList = this.childDepartList.concat(this.allChildDepartList.filter((item) => item.parentDepart === e[i]));
          }
        } else if (Array.isArray(e) && e.length === 0) {
          this.unitList = this.allUnitList;
          this.childDepartList = this.allChildDepartList;
        }
        this.spinner.hide();
        break;
      case 'unit':
        this.element.childDepart = [];
        this.element.unit = e;
        this.childDepartList = [];
        if (Array.isArray(e) && e.length > 0) {
          for (let i = 0; i < e.length; i++) {
            this.childDepartList = this.childDepartList.concat(this.allChildDepartList.filter((item) => item.unit === e[i]));
          }
        } else if (Array.isArray(e) && e.length === 0) {
          if (this.element.parentDepart.length > 0) {
            for (let i = 0; i < this.element.parentDepart.length; i++) {
              this.childDepartList = this.childDepartList.concat(this.allChildDepartList.filter((item) => item.parentDepart === this.element.parentDepart[i]));
            }
          } else {
            this.childDepartList = this.allChildDepartList;
          }
        }
        this.spinner.hide();
        break;
      case 'childDepart':
        this.element.childDepart = e;
        this.spinner.hide();
        break;
      default:
        this.element[str] = e;
        this.spinner.hide();
        break;
    }
  }

  eventButton(e: any) {
    if ((e.keyCode === 13 && !e.shiftKey)) {
      this.getData(false);
    }
  }
}
