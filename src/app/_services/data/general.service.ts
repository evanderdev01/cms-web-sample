import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EnvironmentsService} from '../environments.service';
import {AuthService} from '../auth/auth.service';
import {Howl} from 'howler';

@Injectable()
export class GeneralService {
  baseUrl: any;
  serviceName = '/general-api';
  sound: any;

  constructor(private http: HttpClient, private envService: EnvironmentsService) {
    this.baseUrl = envService.apiUrl + this.serviceName;
  }

  importFile(content) {
    return this.http.post<any>(this.baseUrl + '/import-file', content);
  }

  exportFile(content) {
    return this.http.post(this.baseUrl + '/export-file', content, {responseType: 'blob'});
  }

  submitData(listFiles, isBody?, isImport?, content?) {
    const formData: FormData = new FormData();
    if (listFiles && listFiles.length > 0) {
      for (const file of listFiles) {
        formData.append('dataURI', file.dataURI);
        formData.append('fileType', file.fileType);
        formData.append('fileName', file.fileName);
      }
    }
    if (content) {
      formData.append('content', JSON.stringify(content));
    }
    return formData;
  }

  convertMatDateToDDMMYYY(date: any) {
    if (date && date._i) {
      const d = date._i;
      if (typeof d === 'string') {
        return d;
      }
      return (d.date < 10 ? '0' + d.date : d.date) + '/' +
        (d.month + 1 < 10 ? '0' + (d.month + 1) : d.month + 1) + '/' + d.year;
    }
    return '';
  }

  playAudio() {
    if (!this.sound) {
      this.sound = new Howl({src: ['assets/sounds/notification.wav'], html5: true});
    }
    this.sound.play();
  }

  getSelectChildDepart() {
    const userInfo = sessionStorage.getItem('userInfo');
    if (userInfo) {
      const info = JSON.parse(userInfo);
      const allChildDeparts = info['allChildDeparts'];
      if (allChildDeparts) {
        const parentDepartList: any[] = [];
        const childDepartList: any[] = [];
        for (const item of allChildDeparts) {
          if (!parentDepartList.find(i => i.parentDepart === item.parentDepart)) {
            parentDepartList.push({parentDepart: item.parentDepart, branch: item.branch || ''});
          }
          childDepartList.push({childDepart: item.childDepart, parentDepart: item.parentDepart});
        }
        return {parentDepartList, childDepartList};
      }
    }
    return null;
  }

  sortArray(arr: any[], key: string, direction: 'asc' | 'desc' = 'asc') {
    return arr.sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  validateInput(value, type?) {
    if (type === 'email') {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(value);
    }
    if (type === 'phone') {
      const re = /^[0-9]{10,11}$/;
      return re.test(value);
    }
    return value && value.toString().trim() !== '';
  }

  resizeImage(dataURI, maxWidth, maxHeight) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = height * (maxWidth / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = width * (maxHeight / height);
          height = maxHeight;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL());
      };
      img.src = dataURI;
    });
  }
}
