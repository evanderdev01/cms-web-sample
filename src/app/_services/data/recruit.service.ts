import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EnvironmentsService} from '../environments.service';
import {ActivityLogService} from './activity-log.service';

@Injectable()
export class RecruitService {
  baseUrl: any;
  serviceName = '/recruit-api';

  constructor(private http: HttpClient, private envService: EnvironmentsService, private logService: ActivityLogService) {
    this.baseUrl = envService.apiUrl + this.serviceName;
  }

  getRecruitOverview(content) {
    this.logService.addActivityLog({nameMenu: 'recruit', action: 'show', nameModule: 'recruit'}).subscribe();
    return this.http.post<any>(this.baseUrl + '/get-recruit-overview', content);
  }

  getCandidateList(content) {
    return this.http.post<any>(this.baseUrl + '/get-candidate-list', content);
  }

  getCandidateDetail(content) {
    return this.http.post<any>(this.baseUrl + '/get-candidate-detail', content);
  }

  addCandidate(content) {
    return this.http.post<any>(this.baseUrl + '/add-candidate', content);
  }

  updateCandidate(content) {
    return this.http.post<any>(this.baseUrl + '/update-candidate', content);
  }

  importCandidates(formData) {
    return this.http.post<any>(this.baseUrl + '/import-candidates', formData);
  }

  exportCandidates(content) {
    return this.http.post(this.baseUrl + '/export-candidates', content, {responseType: 'blob'});
  }

  createJob(content) {
    return this.http.post<any>(this.baseUrl + '/create-job', content);
  }
}
