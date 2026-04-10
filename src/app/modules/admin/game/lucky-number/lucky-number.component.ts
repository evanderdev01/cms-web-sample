import {Component, OnInit} from '@angular/core';
import Swal from "sweetalert2";
import {NgxSpinnerService} from "ngx-spinner";
import {GameService} from "../../../../_services/data/game.service";
import {AuthService} from "../../../../_services/auth/auth.service";
import {ConfirmationDialogService} from "../../../../shared/component/confirmation-dialog/confirmation-dialog.service";

@Component({
  selector: 'app-lucky-number',
  templateUrl: './lucky-number.component.html',
  styleUrls: ['./lucky-number.component.scss']
})
export class LuckyNumberComponent implements OnInit {
  dataTable: any;
  page = 1;
  itemPerPage = 10;
  prizeList = [
    {id: 1, name: 'Giải Nhất', value: 'Giải Nhất'},
    {id: 2, name: 'Giải Nhì', value: 'Giải Nhì'},
    {id: 3, name: 'Giải Ba', value: 'Giải Ba'},
    {id: 4, name: 'Giải Khuyến Khích', value: 'Giải Khuyến Khích'},
  ]
  reportList = [
    {name: 'Tất cả', value: 'all_giai_thuong'},
    {name: 'Giải Nhất', value: 'Giải Nhất'},
    {name: 'Giải Nhì', value: 'Giải Nhì'},
    {name: 'Giải Ba', value: 'Giải Ba'},
    {name: 'Giải Khuyến Khích', value: 'Giải Khuyến Khích'},
  ]

  prize = this.prizeList[0].id;
  report = this.reportList[0].value;
  tab = 1;
  detailedPath: any;

  constructor(private spinner: NgxSpinnerService, private gameService: GameService, private authService: AuthService,
              private confirmationDialogService: ConfirmationDialogService) {
  }

  ngOnInit(): void {
    this.detailedPath = window.location.href + '/detail/' + this.prize;
  }

  getPrize() {
    if (this.detailedPath) {
      window.open(this.detailedPath);
    }
  }

  getData(str) {
    const content = {
      condition: {
        giai_thuong: this.report,
        type: str
      },
      name_table: 'lucky_number',
      user_email: this.authService.getEmailUser()
    };
    this.spinner.show();
    this.gameService.selectDataTable(content).subscribe((res) => {
      this.spinner.hide();
      if (res && res.result.status === 1) {
        if (str === 'view') {
          if (res.result.detail.data && res.result.detail.data.length > 0) {
            this.page = 1;
            this.dataTable = res.result.detail.data;
          } else {
            this.dataTable = [];
            Swal.fire('Thông báo', 'Không có dữ liệu', 'warning');
          }
        } else if (str === 'save') {
          if (res.result.detail.file_name) {
            this.confirmationDialogService.confirm('Xác nhận', 'Xác nhận lưu file? ').then((confirmed) => {
              if (confirmed) {
                // Download report file
                window.location.href = '/reports/' + res.result.detail.file_name;
              }
            });
          } else {
            Swal.fire('Lỗi', 'Vui lòng thử lại sau', 'error');
          }
        }
      } else {
        this.dataTable = null;
        Swal.fire('Thông báo', 'Vui lòng thử lại sau', 'warning');
      }
    }, error => {
      this.dataTable = null;
    })
  }

  receiveSelectEvent(e: any, str: any) {
    if (str === 'prize') {
      this.prize = e;
      this.detailedPath = window.location.href + '/detail/' + this.prize;
    } else if (str === 'report') {
      this.report = e;
    }
  }
}
