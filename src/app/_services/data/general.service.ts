import {Injectable} from '@angular/core';
import {ReplaySubject} from "rxjs";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import {NgxSpinnerService} from "ngx-spinner";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../auth/auth.service";
import {Howl} from 'howler';
import {menuList} from "../../_models/constants/menuTemplate";

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  baseUrl: any;
  nameRegex = '^[a-zA-Z ]*$';
  phoneRegex = '^((\\+84[3|5|7|8|9])|(0[3|5|7|8|9])){1}([0-9]{8}$)';
  emailRegex = '^[a-zA-Z0-9.!#$%&\'*+/=?^_`{|}~-]+@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$';
  menuList: any;

  constructor(
    private spinnerService: NgxSpinnerService,
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.menuList = menuList;
    this.baseUrl = this.authService.getDomain();
  }

  storeFile(data: any, filename?: any) {
    const sheet = {};
    const sheetName: any[] = [];
    Object.keys(data).forEach(key => {
      Object.assign(sheet, {[key]: XLSX.utils.json_to_sheet(data[key])});
      sheetName.push(key);
    });
    const workbook: XLSX.WorkBook = {Sheets: sheet, SheetNames: sheetName};
    XLSX.writeFile(workbook, this.toExportFileName(filename));
  }

  toExportFileName(excelFileName: string): string {
    const day = new Date();
    return excelFileName + '_' + this.convertToString(day.getDate())
      + this.convertToString(day.getMonth() + 1)
      + this.convertToString(day.getFullYear()) + '_' + day.getTime().toString() + '.xlsx';
  }

  addFile(event, str?) {
    let file: any;
    if (str) {
      file = event[0];
    } else {
      file = event.target.files[0];
    }
    const fileReader = new FileReader();
    let arrayBuffer;
    let list: ReplaySubject<any> = new ReplaySubject(1);
    if (file) {
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) => {
        arrayBuffer = fileReader.result;
        const data = new Uint8Array(arrayBuffer);
        const arr: any = [];
        for (let i = 0; i != data.length; ++i) {
          arr[i] = String.fromCharCode(data[i]);
        }
        const bstr = arr.join('');
        const workbook = XLSX.read(bstr, {type: 'binary', cellDates: true, dateNF: 'dd/mm/yyyy;@'});
        const first_sheet_name = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[first_sheet_name];
        const [columns] = XLSX.utils.sheet_to_json(worksheet, {header: 1});
        list.next({
          data: XLSX.utils.sheet_to_json(worksheet, {raw: false}),
          nameColumn: columns
        });
      };
    }
    return list;
  }

  convertMatDateToDDMMYYY(date: any) {
    const d = new Date(date);
    return [this.convertToString(d.getDate()), this.convertToString(d.getMonth() + 1), this.convertToString(d.getFullYear())].join('/');
  }

  convertMatDateToYYYYMMDD(date: any) {
    const d = new Date(date);
    return [this.convertToString(d.getFullYear()), this.convertToString(d.getMonth() + 1), this.convertToString(d.getDate())].join('-');
  }

  convertToString(n: any): any {
    return n > 9 ? '' + n.toString() : '0' + n.toString();
  }

  getDayDiff(startDate: Date, endDate: Date): number {
    const msInDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((new Date(endDate)).getTime() - (new Date(startDate)).getTime()) / msInDay);
  }

  submitData(listFiles: any, isCanvas?: any, readFileName?: any, element?) {
    const formData = new FormData();
    if (isCanvas) {
      formData.append('numberFile', listFiles.length.toString());
      formData.append('email', this.authService.getEmailUser());
      listFiles.forEach((i: any, index: any) => {
        const blob = this.b64toBlob(i.canvas.toDataURL("image/jpeg", 0.6), 'image/jpeg');
        formData.append('file_' + (index + 1), blob, 'image_' + (index + 1) + '_' + Math.random() + '.jpg');
      });
    } else {
      if (listFiles && listFiles.length > 0) {
        formData.append('numberFile', listFiles.length.toString());
        formData.append('folder', 'form_import');
        formData.append('userEmail', this.authService.getEmailUser());
        listFiles.forEach((i, index) => {
          const blob = this.b64toBlob(i.dataURI, i.fileType);
          let fileType = '';
          if (i.fileType === 'application/msword') {
            fileType = '.doc';
          } else if (i.fileType === 'application/pdf') {
            fileType = '.pdf';
          } else if (i.fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            fileType = '.docx';
          } else if (i.fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            fileType = '.xlsx';
          } else if (i.fileType === 'image/jpeg') {
            fileType = '.jpg';
          } else if (i.fileType === 'image/png') {
            fileType = '.png';
          }
          if (readFileName) {
            formData.append('file_' + (index + 1), blob, i.fileName + fileType);
          } else {
            formData.append('file_' + (index + 1), blob, 'file_' + (index + 1) + '_' + Math.random() + fileType);
          }
        });
      }
    }
    if (element) {
      Object.keys(element).forEach((key) => {
        formData.append(key, element[key]);
      });
    }
    return formData;
  }

  importFile(formData) {
    return this.http.post<any>(this.baseUrl + '/media-api/upload-file-private', formData);
  }

  b64toBlob(dataURI: any, fileType: any) {
    const byteString = atob(dataURI.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {type: fileType});
  }

  preventInput(type, e): any {
    e = e || window.event;
    let re: any;
    const c = e.keyCode;
    const ctrlDown = e.ctrlKey || e.metaKey;
    if (ctrlDown && (c === 67 || c === 86 || c === 88 || c === 65)) {
      return true;
    }
    if (e.keyCode === 8 || e.keyCode === 46 || e.keyCode === 37 || e.keyCode === 39 || e.keyCode === 13 || e.keyCode === 9) {
      return true;
    }
    if (e.keyCode === 109 || e.keyCode === 107 || e.keyCode === 187 || e.keyCode === 189) {
      return false;
    }
    if (type === 'number') {
      re = '^([0-9.])';
      const regExp = new RegExp(re, 'g');
      return regExp.test(e.key);
    } else if (type === 'code') {
      re = '^([a-zA-Z0-9 ]+)$';
      const regExp = new RegExp(re);
      return regExp.test(e.key);
    }
    return true;
  }

  checkPhone(str) {
    if (str === '') {
      Swal.fire('Warning', 'Field is required', 'warning');
      return false;
    }
    const re = this.phoneRegex;
    const regExp = new RegExp(re, 'g');
    const result = regExp.test(str);
    if (!result) {
      Swal.fire('Warning', 'Invalid phone number', 'warning');
    }
    return result;
  }

  checkEmail(str) {
    if (str === '') {
      Swal.fire('Warning', 'Field is required', 'warning');
      return false;
    }
    const re = this.emailRegex;
    const regExp = new RegExp(re, 'g');
    const result = regExp.test(str);
    if (!result) {
      Swal.fire('Warning', 'Invalid email format', 'warning');
    }
    return result;
  }

  getSelectedMenu(menu) {
    for (const m of menu) {
      if (window.location.href.includes(m.link)) {
        if (m.list && m.list.length > 0) {
          return this.getSelectedMenu(m.list);
        } else {
          return m;
        }
      }
    }
  }

  getDomain() {
    return this.authService.getDomain();
  }

  getDownloadUrl() {
    return this.authService.getDownloadUrl();
  }

  sortTable(column, dataTable) {
    if (column.sort === '') {
      column.sort = 'asc';
      dataTable.sort((a, b) => {
        if (a[column.label] < b[column.label]) return -1;
        if (a[column.label] > b[column.label]) return 1;
        return 0;
      });
    } else if (column.sort === 'asc') {
      column.sort = 'desc';
      dataTable.sort((a, b) => {
        if (a[column.label] > b[column.label]) return -1;
        if (a[column.label] < b[column.label]) return 1;
        return 0;
      });
    } else {
      dataTable.sort((a, b) => a.id - b.id);
      column.sort = '';
    }
    return dataTable;
  }

  sanitizeInput(input) {
    return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').replace(/<\/?[^>]+(>|$)/g, '');
  }

  playAudio() {
    const sound = new Howl({
      src: ['assets/sounds/pristine.mp3'],
      html5: true,
      onload() {
        if (sound != null) {
          if (!sound.playing()) {
            sound.play();
          } else {
            sound.stop();
            sound.unload();
            sound.play();
          }
        }
      },
      onplayerror() {
        sound.once('unlock', () => {
          sound.play();
        });
      }
    });
  }

  trackByFn(index: any, item: any) {
    return index;
  }
}
