import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EnvironmentsService} from '../environments.service';
import {ActivityLogService} from './activity-log.service';

@Injectable()
export class CompanyService {
  baseUrl: any;
  serviceName = '/company-api';

  constructor(private http: HttpClient, private envService: EnvironmentsService, private logService: ActivityLogService) {
    this.baseUrl = envService.apiUrl + this.serviceName;
  }

  getRevamp(content) {
    this.logService.addActivityLog({nameMenu: 'revamp', action: 'show', nameModule: 'revamp'}).subscribe();
    return this.http.post<any>(this.baseUrl + '/get-revamp', content);
  }

  addRevamp(content) {
    return this.http.post<any>(this.baseUrl + '/add-revamp', content);
  }

  updateRevamp(content) {
    return this.http.post<any>(this.baseUrl + '/update-revamp', content);
  }

  deleteRevamp(content) {
    return this.http.post<any>(this.baseUrl + '/delete-revamp', content);
  }

  getCompanyInfo() {
    return this.http.post<any>(this.baseUrl + '/get-company-info', {});
  }
}
