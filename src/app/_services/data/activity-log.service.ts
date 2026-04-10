import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EnvironmentsService} from '../environments.service';

@Injectable()
export class ActivityLogService {
  baseUrl: any;
  serviceName = '/log-api';

  constructor(private http: HttpClient, private envService: EnvironmentsService) {
    this.baseUrl = envService.apiUrl + this.serviceName;
  }

  addActivityLog(content) {
    return this.http.post<any>(this.baseUrl + '/add-log-user-result', content);
  }

  getActivityLog(content) {
    return this.http.post<any>(this.baseUrl + '/get-log-user-result', content);
  }

  getActivityLogChart(content) {
    return this.http.post<any>(this.baseUrl + '/get-log-user-result-chart', content);
  }

  getActivityLogExport(content) {
    return this.http.post(this.baseUrl + '/export-log-user-result', content, {responseType: 'blob'});
  }

  getOverviewAdmin(content) {
    return this.http.post<any>(this.baseUrl + '/get-overview-admin', content);
  }

  getOverviewModule(content) {
    return this.http.post<any>(this.baseUrl + '/get-overview-module', content);
  }
}
