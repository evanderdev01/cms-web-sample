import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EnvironmentsService} from '../environments.service';
import {ActivityLogService} from './activity-log.service';

@Injectable()
export class JobService {
  baseUrl: any;
  serviceName = '/job-api';

  constructor(private http: HttpClient, private envService: EnvironmentsService, private logService: ActivityLogService) {
    this.baseUrl = envService.apiUrl + this.serviceName;
  }

  getJobList(content) {
    this.logService.addActivityLog({nameMenu: 'captain', action: 'show', nameModule: 'captain'}).subscribe();
    return this.http.post<any>(this.baseUrl + '/get-job-list', content);
  }

  getJobDetail(content) {
    return this.http.post<any>(this.baseUrl + '/get-job-detail', content);
  }

  updateJob(content) {
    return this.http.post<any>(this.baseUrl + '/update-job', content);
  }

  getReportJob(content) {
    return this.http.post<any>(this.baseUrl + '/get-report-job', content);
  }
}
