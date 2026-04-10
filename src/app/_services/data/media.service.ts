import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EnvironmentsService} from '../environments.service';
import {ActivityLogService} from './activity-log.service';

@Injectable()
export class MediaService {
  baseUrl: any;
  serviceName = '/media-api';

  constructor(private http: HttpClient, private envService: EnvironmentsService, private logService: ActivityLogService) {
    this.baseUrl = envService.apiUrl + this.serviceName;
  }

  getLibrary(content) {
    this.logService.addActivityLog({nameMenu: 'library', action: 'show', human-re: 'library'}).subscribe();
    return this.http.post<any>(this.baseUrl + '/get-library', content);
  }

  addLibrary(formData) {
    return this.http.post<any>(this.baseUrl + '/add-library', formData);
  }

  updateLibrary(content) {
    return this.http.post<any>(this.baseUrl + '/update-library', content);
  }

  downloadLibrary(url) {
    return this.http.get(this.baseUrl + '/download-library?url=' + url, {responseType: 'blob'});
  }

  getMeeting(content) {
    return this.http.post<any>(this.baseUrl + '/get-meeting', content);
  }

  addMeeting(formData) {
    return this.http.post<any>(this.baseUrl + '/add-meeting', formData);
  }

  updateLibraryMeeting(content) {
    return this.http.post<any>(this.baseUrl + '/update-library-meeting', content);
  }

  getEmailListFollowChildDepart(childDepartList) {
    return this.http.post<any>(this.baseUrl + '/get-email-list-follow-child-depart', {childDepartList});
  }

  submitData(listFiles, typeDoc, element) {
    const formData: FormData = new FormData();
    if (listFiles && listFiles.length > 0) {
      formData.append('dataURI', listFiles[0].dataURI);
      formData.append('fileType', listFiles[0].fileType);
      formData.append('fileName', listFiles[0].fileName);
    }
    formData.append('typeDoc', typeDoc);
    formData.append('element', JSON.stringify(element));
    return formData;
  }
}
