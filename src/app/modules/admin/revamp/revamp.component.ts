import {Component, OnInit} from '@angular/core';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from "@angular/material-moment-adapter";
import {GeneralService} from "../../../_services/data/general.service";
import {CompanyService} from "../../../_services/data/company.service";
import Swal from "sweetalert2";
import {NgxSpinnerService} from "ngx-spinner";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DetailRevampComponent} from "./detail-revamp/detail-revamp.component";
import {AuthService} from "../../../_services/auth/auth.service";
import {ConfirmationDialogService} from "../../../shared/component/confirmation-dialog/confirmation-dialog.service";

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
  selector: 'app-revamp',
  templateUrl: './revamp.component.html',
  styleUrls: ['./revamp.component.scss'],
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
export class RevampComponent implements OnInit {
  maxDate: any = new Date();
  isEmptyPerson = false;

  allParentDepartList: any;
  parentDepartList: any;
  allUnitList: any;
  unitList: any;
  allChildDepartList: any;
  childDepartList: any;

  dataTablePerson: any;
  pagePerson = 1;
  itemPerPagePerson = 10;
  totalItemsPerson: any;

  dataTableDepart: any;
  pageDepart = 1;
  itemPerPageDepart = 10;
  totalItemsDepart: any;

  dictKeyList: any;
  columnTable: any;
  typeTitleList: any;
  searchItem: any = {
    parentDepart: [],
    unit: [],
    childDepart: [],
    textSearch: '',
    startDate: new Date((new Date()).getFullYear(), (new Date()).getMonth(), 1),
    endDate: new Date(),
    listTypeTitle: [],
    typeSearch: 'depart'
  }

  constructor(private generalService: GeneralService, private companyService: CompanyService, private spinner: NgxSpinnerService,
              private modalService: NgbModal, private authService: AuthService, private confirmationDialogService: ConfirmationDialogService) {
  }

  ngOnInit(): void {
    this.getSelectChildDepart();
    this.getTypeList();
  }

  getTypeList() {
    this.companyService.getTypeImproveCar().subscribe((res) => {
      this.spinner.hide();
      if (res && res.statusCode === 1) {
        this.typeTitleList = res.data;
      }
    });
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

  receiveSelectEvent(e: any, str: any) {
    this.spinner.show();
    switch (str) {
      case 'parentDepart':
        this.searchItem.unit = [];
        this.searchItem.childDepart = [];
        this.searchItem.parentDepart = e;
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
        this.searchItem.childDepart = [];
        this.searchItem.unit = e;
        this.childDepartList = [];
        if (Array.isArray(e) && e.length > 0) {
          for (let i = 0; i < e.length; i++) {
            this.childDepartList = this.childDepartList.concat(this.allChildDepartList.filter((item) => item.unit === e[i]));
          }
        } else if (Array.isArray(e) && e.length === 0) {
          if (this.searchItem.parentDepart.length > 0) {
            for (let i = 0; i < this.searchItem.parentDepart.length; i++) {
              this.childDepartList = this.childDepartList.concat(this.allChildDepartList.filter((item) => item.parentDepart === this.searchItem.parentDepart[i]));
            }
          } else {
            this.childDepartList = this.allChildDepartList;
          }
        }
        this.spinner.hide();
        break;
      case 'childDepart':
        this.searchItem.childDepart = e;
        this.spinner.hide();
        break;
      default:
        this.searchItem[str] = e;
        this.spinner.hide();
        break;
    }
  }

  getData(page?) {
    let content;
    let p;
    if (page) {
      p = page;
    } else {
      p = 1;
    }
    let itemPerPage: any;
    if (this.searchItem.typeSearch === 'depart' && this.childDepartList && this.childDepartList.length > 0) {
      itemPerPage = this.itemPerPageDepart;
      if (this.generalService.getDayDiff(this.searchItem.startDate, this.searchItem.endDate) > 31) {
        Swal.fire('Thông báo', 'Vui lòng không chọn quá 31 ngày', 'warning');
      } else {
        let childDepart: any;
        if (this.searchItem.childDepart.length === 0) {
          childDepart = this.childDepartList.map(i => i.childDepart);
        } else {
          childDepart = this.searchItem.childDepart;
        }
        content = {
          startDate: this.generalService.convertMatDateToDDMMYYY(new Date(this.searchItem.startDate)),
          endDate: this.generalService.convertMatDateToDDMMYYY(new Date(this.searchItem.endDate)),
          listChildDepart: childDepart,
          listTypeTitle: this.searchItem.listTypeTitle
        }
      }
    } else if (this.searchItem.typeSearch === 'person') {
      itemPerPage = this.itemPerPagePerson;
      if (this.searchItem.textSearch === '') {
        this.isEmptyPerson = true;
      } else {
        const reg = new RegExp('^\\d+$', 'g');
        if (reg.test(this.searchItem.textSearch.trim().toString())) {
          content = {
            startDate: this.generalService.convertMatDateToDDMMYYY(new Date(this.searchItem.startDate)),
            endDate: this.generalService.convertMatDateToDDMMYYY(new Date(this.searchItem.endDate)),
            code: this.searchItem.textSearch.trim(),
            listChildDepart: [],
            listTypeTitle: this.searchItem.listTypeTitle
          }
        } else if (this.searchItem.textSearch.trim().includes('@')) {
          content = {
            startDate: this.generalService.convertMatDateToDDMMYYY(new Date(this.searchItem.startDate)),
            endDate: this.generalService.convertMatDateToDDMMYYY(new Date(this.searchItem.endDate)),
            result: this.searchItem.result,
            email: this.searchItem.textSearch.trim(),
            listChildDepart: [],
            listTypeTitle: this.searchItem.listTypeTitle
          }
        } else {
          content = {
            startDate: this.generalService.convertMatDateToDDMMYYY(new Date(this.searchItem.startDate)),
            endDate: this.generalService.convertMatDateToDDMMYYY(new Date(this.searchItem.endDate)),
            result: this.searchItem.result,
            name: this.searchItem.textSearch.trim(),
            listChildDepart: [],
            listTypeTitle: this.searchItem.listTypeTitle
          }
        }
      }
    }
    if (content) {
      this.spinner.show();
      this.companyService.getListImproveCar(content, p, itemPerPage).subscribe((res) => {
        this.spinner.hide();
        if (res && res.statusCode === 1) {
          if (res.data.list_data && res.data.list_data.length === 0) {
            if (this.searchItem.typeSearch === 'depart') {
              this.dataTableDepart = [];
            } else if (this.searchItem.typeSearch === 'person') {
              this.dataTablePerson = [];
            }
            Swal.fire('Thông báo', 'Không có dữ liệu', 'warning');
          } else {
            if (this.searchItem.typeSearch === 'depart') {
              this.pageDepart = p;
              this.dataTableDepart = res.data.list_data;
              this.totalItemsDepart = res.data.count;
            } else if (this.searchItem.typeSearch === 'person') {
              this.pagePerson = p;
              this.dataTablePerson = res.data.list_data;
              this.totalItemsPerson = res.data.count;
            }
            this.dictKeyList = res.data.dict_keys;
            this.columnTable = Object.keys(res.data.dict_keys);
          }
        } else {
          if (this.searchItem.typeSearch === 'depart') {
            this.dataTableDepart = null;
          } else if (this.searchItem.typeSearch === 'person') {
            this.dataTablePerson = null;
          }
          Swal.fire('Thông báo', res.message, 'warning');
        }
      }, error => {
        if (this.searchItem.typeSearch === 'depart') {
          this.dataTableDepart = null;
        } else if (this.searchItem.typeSearch === 'person') {
          this.dataTablePerson = null;
        }
      });
    }
  }

  eventButton(e: any) {
    if ((e.keyCode === 13 && !e.shiftKey)) {
      this.getData();
    }
  }

  exportData() {
    let content: any;
    if (this.searchItem.typeSearch === 'depart') {
      if (this.generalService.getDayDiff(this.searchItem.startDate, this.searchItem.endDate) > 31) {
        Swal.fire('Thông báo', 'Vui lòng không chọn quá 31 ngày', 'warning');
      } else {
        let childDepart: any;
        if (this.searchItem.childDepart.length === 0) {
          childDepart = this.childDepartList.map(i => i.childDepart);
        } else {
          childDepart = this.searchItem.childDepart;
        }
        content = {
          startDate: this.generalService.convertMatDateToDDMMYYY(new Date(this.searchItem.startDate)),
          endDate: this.generalService.convertMatDateToDDMMYYY(new Date(this.searchItem.endDate)),
          listChildDepart: childDepart,
          listTypeTitle: this.searchItem.listTypeTitle
        }
      }
    } else if (this.searchItem.typeSearch === 'person') {
      if (this.searchItem.textSearch === '') {
        this.isEmptyPerson = true;
      } else {
        const reg = new RegExp('^\\d+$', 'g');
        if (reg.test(this.searchItem.textSearch.trim().toString())) {
          content = {
            startDate: this.generalService.convertMatDateToDDMMYYY(new Date(this.searchItem.startDate)),
            endDate: this.generalService.convertMatDateToDDMMYYY(new Date(this.searchItem.endDate)),
            code: this.searchItem.textSearch.trim(),
            listChildDepart: [],
            listTypeTitle: []
          }
        } else if (this.searchItem.textSearch.trim().includes('@')) {
          content = {
            startDate: this.generalService.convertMatDateToDDMMYYY(new Date(this.searchItem.startDate)),
            endDate: this.generalService.convertMatDateToDDMMYYY(new Date(this.searchItem.endDate)),
            result: this.searchItem.result,
            email: this.searchItem.textSearch.trim(),
            listChildDepart: [],
            listTypeTitle: []
          }
        } else {
          content = {
            startDate: this.generalService.convertMatDateToDDMMYYY(new Date(this.searchItem.startDate)),
            endDate: this.generalService.convertMatDateToDDMMYYY(new Date(this.searchItem.endDate)),
            result: this.searchItem.result,
            name: this.searchItem.textSearch.trim(),
            listChildDepart: [],
            listTypeTitle: []
          }
        }
      }
    }
    if (content) {
      this.confirmationDialogService.confirm('Xác nhận', 'Xác nhận lưu file?').then((confirmed: any) => {
        if (confirmed === true) {
          this.spinner.show();
          this.companyService.exportImproveCar(content).subscribe((res) => {
            this.spinner.hide();
            if (res && res.statusCode === 1) {
              this.generalService.storeFileNoQuestion(res.data, 'Bao_cao_xe_cai_tien')
            } else {
              Swal.fire('Thông báo', res.message, 'warning');
            }
          });
        }
      });
    }
  }

  openDetail(d) {
    const content = {
      id: d.id,
      status: 'ALL'
    }
    this.spinner.show();
    this.companyService.getDetailImproveCar(content).subscribe((res) => {
      this.spinner.hide();
      if (res && res.statusCode === 1) {
        const modalRef = this.modalService.open(DetailRevampComponent, {size: 'lg'});
        modalRef.componentInstance.obj = Object.assign(d, res.data);
      } else {
        Swal.fire('Thông báo', res.message, 'warning');
      }
    })
  }

  pageChangeEvent(e) {
    if (this.searchItem.typeSearch === 'depart') {
      this.pageDepart = e;
      this.getData(this.pageDepart);
    } else if (this.searchItem.typeSearch === 'person') {
      this.pagePerson = e;
      this.getData(this.pagePerson);
    }
  }
}
