import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivityLogService} from '../../../_services/data/activity-log.service';
import {NgxSpinnerService} from "ngx-spinner";
import Swal from "sweetalert2";
import {GeneralService} from "../../../_services/data/general.service";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from "@angular/material-moment-adapter";
import Chart from "chart.js/auto";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DetailChartComponent} from "./detail-chart/detail-chart.component";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {forkJoin} from 'rxjs';
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
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.scss'],
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
export class ActivityLogComponent implements OnInit, OnDestroy {
  maxDate: any = new Date();
  isEmptyPerson = false;
  isEmptyDepart = false;

  listData: any;
  listDataLength = 0;
  pageList = 1;
  itemPerPageList = 10;
  totalItemList: any;

  overviewData: any;
  keyDataOverview: any;
  sumDataOverview: any;

  dataTablePerson: any;
  pagePerson = 1;
  itemPerPagePerson = 10;
  totalItemsPerson: any;

  dataTableFuncName: any;
  pageFuncName = 1;
  itemPerPageFuncName = 10;
  totalItemsFuncName: any;

  pieBackgroundConfig = [
    '#E64C3B', '#FF971D', '#D345EA', '#00BE2A', '#7A0099',
    '#106550', '#864C08', '#222684', '#B10000', '#279B8D',
    '#BE0980', '#839610', '#5767FB', '#37CAF9', '#8C64FF'
  ];
  pieChart: any;
  lablePieChart: any;

  listFunctionData: any;
  listActionData: any;

  dictKeyList: any;
  columnTable: any;
  searchItem: any = {
    functionCode: '',
    actionCode: '',
    textSearch: '',
    startDate: new Date((new Date()).getFullYear(), (new Date()).getMonth(), 1),
    endDate: new Date(),
    typeSearch: 'all'
  }

  myChart: any;
  myChartDetail: any;
  listChart = [
    {label: 'Chi tiết', value: 'log-user-detail'},
    {label: 'Tổng quan', value: 'log-user'}
  ];
  dataChart: any;
  dataChartDetail: any;

  constructor(private activityLogService: ActivityLogService, private spinner: NgxSpinnerService,
              private generalService: GeneralService, private modalService: NgbModal,
              private confirmationDialogService: ConfirmationDialogService) {
  }

  ngOnDestroy(): void {
    if (this.myChart) {
      this.myChart.destroy();
    }
    if (this.myChartDetail) {
      this.myChartDetail.destroy();
    }
  }

  ngOnInit(): void {
    this.getAllLogUser('EN');
    this.getFunctionData();
    this.getData()
  }

  getData(page?) {
    let content;
    let p = page || 1;
    let itemPerPage: any;

    if (this.generalService.getDayDiff(this.searchItem.startDate, this.searchItem.endDate) > 31) {
      Swal.fire('Thất bại', 'Vui lòng không chọn quá 31 ngày', 'warning');
    } else {
      if (this.searchItem.typeSearch === 'overview') {
        this.getAllLogUser('EN');
      } else if (this.searchItem.typeSearch === 'all') {
        content = {
          startDate: this.generalService.convertMatDateToDDMMYYY(this.searchItem.startDate),
          endDate: this.generalService.convertMatDateToDDMMYYY(this.searchItem.endDate)
        }
        this.spinner.show();
        this.activityLogService.getChartLogs(content).subscribe((res) => {
          this.spinner.hide();
          if (res && res.statusCode === 1) {
            this.dataChart = res.data;
            this.getChart('myChart', 'dataChart');
          } else {
            Swal.fire('Thông báo', res.message, 'warning');
          }
        });
      } else {
        if (this.searchItem.typeSearch === 'person') {
          itemPerPage = this.itemPerPagePerson;
          if (this.searchItem.textSearch === '') {
            content = {
              startDate: this.generalService.convertMatDateToDDMMYYY(this.searchItem.startDate),
              endDate: this.generalService.convertMatDateToDDMMYYY(this.searchItem.endDate),
              result: this.searchItem.result,
              name: ''
            }
          } else {
            const reg = new RegExp('^\\d+$', 'g');
            if (reg.test(this.searchItem.textSearch.trim().toString())) {
              content = {
                startDate: this.generalService.convertMatDateToDDMMYYY(this.searchItem.startDate),
                endDate: this.generalService.convertMatDateToDDMMYYY(this.searchItem.endDate),
                code: this.searchItem.textSearch.trim()
              }
            } else if (this.searchItem.textSearch.trim().includes('@')) {
              content = {
                startDate: this.generalService.convertMatDateToDDMMYYY(this.searchItem.startDate),
                endDate: this.generalService.convertMatDateToDDMMYYY(this.searchItem.endDate),
                result: this.searchItem.result,
                email: this.searchItem.textSearch.trim()
              }
            } else {
              content = {
                startDate: this.generalService.convertMatDateToDDMMYYY(this.searchItem.startDate),
                endDate: this.generalService.convertMatDateToDDMMYYY(this.searchItem.endDate),
                result: this.searchItem.result,
                name: this.searchItem.textSearch.trim()
              }
            }
          }
        } else if (this.searchItem.typeSearch === 'func') {
          itemPerPage = this.itemPerPageFuncName;
          if (this.searchItem.functionCode === '') {
            Swal.fire('Thất bại', 'Vui lòng chọn Tên chức năng để xem thông tin', 'warning');
          } else {
            content = {
              functionCode: this.searchItem.functionCode,
              actionCode: this.searchItem.actionCode,
              startDate: this.generalService.convertMatDateToDDMMYYY(this.searchItem.startDate),
              endDate: this.generalService.convertMatDateToDDMMYYY(this.searchItem.endDate),
            }
          }
        }

        if (content) {
          this.spinner.show();
          this.activityLogService.searchLogUser(content, p, itemPerPage).subscribe((res) => {
            this.spinner.hide();
            if (res && res.statusCode === 1) {
              if (this.searchItem.typeSearch === 'person') {
                this.pagePerson = p;
                this.dataTablePerson = res.data.list_data;
                this.totalItemsPerson = res.data.number_row;
                this.dictKeyList = res.data.dict_keys;
                this.columnTable = Object.keys(res.data.dict_keys);
              } else if (this.searchItem.typeSearch === 'func') {
                this.pageFuncName = p;
                this.dataTableFuncName = res.data.list_data;
                this.totalItemsFuncName = res.data.number_row;
                this.dictKeyList = res.data.dict_keys;
                this.columnTable = Object.keys(res.data.dict_keys);
              }
            } else if (res && res.statusCode === 6) {
              if (this.searchItem.typeSearch === 'person') {
                this.dataTablePerson = res.data;
              } else if (this.searchItem.typeSearch === 'func') {
                this.dataTableFuncName = res.data;
              }
              Swal.fire('Thông báo', res.message, 'warning');
            } else {
              if (this.searchItem.typeSearch === 'person') {
                this.dataTablePerson = null;
              } else if (this.searchItem.typeSearch === 'func') {
                this.dataTableFuncName = null;
              }
              Swal.fire('Thất bại', res.message, 'error');
            }
          }, error => {
            if (this.searchItem.typeSearch === 'person') {
              this.dataTablePerson = null;
            } else if (this.searchItem.typeSearch === 'func') {
              this.dataTableFuncName = null;
            }
          });
        }
      }
    }
  }

  getFunctionData() {
    this.listFunctionData = [];
    this.listActionData = [];
    this.activityLogService.allFunctionData('', this.searchItem.functionCode, 0).subscribe((res) => {
      if (res && res.statusCode === 1) {
        this.listFunctionData = res.data;
      }
    });
    if (this.listFunctionData.length > 0) {
      this.allgetFunctionData(this.searchItem.actionCode, 'functionCode')
    }
  }

  allgetFunctionData(e: any, str: any) {
    switch (str) {
      case 'functionCode':
        this.listActionData = [];
        this.searchItem.functionCode = e;
        this.searchItem.actionCode = [];
        this.activityLogService.allFunctionData('', this.searchItem.functionCode, 0).subscribe((res) => {
          if (res && res.statusCode === 1) {
            this.listActionData = res.data;
          } else {
            Swal.fire('Thất bại', res.message, 'warning');
          }
        });
        break;
      default:
        this.searchItem.actionCode = e;
        break;
    }
  }

  getChart(nameChart, nameData) {
    if (document.getElementById(nameChart)) {
      if (this[nameChart]) {
        this[nameChart].destroy();
      }
      const ctx = document.getElementById(nameChart);
      this[nameChart] = new Chart(ctx, {
        plugins: [ChartDataLabels],
        type: 'bar',
        data: {
          labels: this[nameData].map(i => i.name),
          datasets: [{
            data: this[nameData].map(i => i.count),
            backgroundColor: this.pieBackgroundConfig,
            borderWidth: 1
          }]
        },
        options: {
          onHover: (event, chartElement) => {
            event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
          },
          layout: {
            padding: 20,
          },
          scales: {
            y: {
              beginAtZero: true,
            }
          },
          responsive: true,
          animation: true,
          plugins: {
            datalabels: {
              color: 'black',
              anchor: 'end',
              align: 'end',
              padding: 1,
              clamp: true,
              font: {
                weight: "bold",
              },
            },
            legend: {
              display: false
            },
            tooltip: {
              enabled: true
            }
          }
        },
      })
      document.getElementById(nameChart)!.onclick = (evt) => {
        const res = this[nameChart].getElementsAtEventForMode(
          evt,
          'nearest',
          {intersect: true},
          true
        );
        if (res.length === 0) {
          return;
        } else {
          if (nameChart === 'myChart') {
            this.searchItem.functionCode = this.dataChart.filter(i => i.name === this.myChart.data.labels[res[0].index])[0].code;
            this.allgetFunctionData(this.searchItem.functionCode, 'functionCode')
            const content = {
              functionCode: this.searchItem.functionCode,
              startDate: this.generalService.convertMatDateToDDMMYYY(this.searchItem.startDate),
              endDate: this.generalService.convertMatDateToDDMMYYY(this.searchItem.endDate)
            }
            this.spinner.show();
            this.activityLogService.getDetailChartLogs(content).subscribe((re) => {
              this.spinner.hide();
              if (re && re.statusCode === 1) {
                const modalRef = this.modalService.open(DetailChartComponent, {size: 'xl'});
                modalRef.componentInstance.dataChartDetail = re.data;
                modalRef.componentInstance.title = this.myChart.data.labels[res[0].index];
              } else {
                Swal.fire('Thông báo', re.message, 'warning');
              }
            });
          }
        }
      };
    }
  }

  getAllLogUser(str?) {
    let content;
    content = {
      startDate: this.generalService.convertMatDateToDDMMYYY(this.searchItem.startDate),
      endDate: this.generalService.convertMatDateToDDMMYYY(this.searchItem.endDate),
      show: str || ''
    }
    if (!str) {
      this.confirmationDialogService.confirm('Xác nhận', 'Xác nhận lưu file?').then((confirmed: any) => {
        if (confirmed === true) {
          this.spinner.show();
          this.activityLogService.getSumOverview(content).subscribe((res) => {
            this.spinner.hide();
            if (res && res.statusCode === 1) {
              this.generalService.storeFileNoQuestion({sheet1: res.data}, 'Report_Activity_Log_' + this.generalService.convertMatDateToDDMMYYY(this.searchItem.startDate) + '_' + this.generalService.convertMatDateToDDMMYYY(this.searchItem.endDate) + '.xlsx');
            } else {
              Swal.fire('Thông báo', res.message, 'warning');
            }
          });
        }
      });
    } else {
      this.spinner.show();
      this.activityLogService.getSumOverview(content).subscribe((res) => {
        this.spinner.hide();
        let data_list: any;
        let pie_chart: any;
        if (res && res.statusCode === 1) {
          data_list = res.data.data_list_ac;
          pie_chart = res.data.data_list_func;
          this.keyDataOverview = res.data.key_data
          if (data_list && data_list.length === 0) {
            this.overviewData = [];
            Swal.fire('Thông báo', 'Không có dữ liệu', 'warning');
          } else {
            this.overviewData = data_list;
            this.sumDataOverview = res.data.sum_count;
          }
          if (pie_chart && pie_chart.length > 0) {
            this.lablePieChart = pie_chart.map(i => i.name)
            this.pieChart = res.data.pie_chart_key;
            Object.keys(this.pieChart).forEach((key) => {
              for (const i of pie_chart) {
                if (i.code === key) {
                  this.pieChart[key] = i.count;
                  break
                }
              }
            });
          }
        } else {
          this.overviewData = []
          Swal.fire('Thông báo', res.message, 'warning');
        }
      });
    }
  }

  pageChangeEvent(e) {
    if (this.searchItem.typeSearch === 'person') {
      this.pagePerson = e;
      this.getData(this.pagePerson);
    } else if (this.searchItem.typeSearch === 'func') {
      this.pageFuncName = e;
      this.getData(this.pageFuncName);
    }
  }
}
