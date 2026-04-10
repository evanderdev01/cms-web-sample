import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EnvironmentsService} from '../environments.service';
import {ActivityLogService} from './activity-log.service';

@Injectable()
export class CheckinService {
  baseUrl: any;
  serviceName = '/checkin-api';

  constructor(private http: HttpClient, private envService: EnvironmentsService, private logService: ActivityLogService) {
    this.baseUrl = envService.apiUrl + this.serviceName;
  }

  getCheckinData(content) {
    this.logService.addActivityLog({nameMenu: 'checkin', action: 'show', nameModule: 'hr'}).subscribe();
    return this.http.post<any>(this.baseUrl + '/get-checkin-data', content);
  }

  addCheckin(content) {
    return this.http.post<any>(this.baseUrl + '/add-checkin', content);
  }

  updateCheckin(content) {
    return this.http.post<any>(this.baseUrl + '/update-checkin', content);
  }

  exportCheckin(content) {
    return this.http.post(this.baseUrl + '/export-checkin', content, {responseType: 'blob'});
  }
}
