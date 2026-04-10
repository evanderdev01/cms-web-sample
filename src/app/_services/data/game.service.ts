import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EnvironmentsService} from '../environments.service';
import {ActivityLogService} from './activity-log.service';

@Injectable()
export class GameService {
  baseUrl: any;
  serviceName = '/game-api';

  constructor(private http: HttpClient, private envService: EnvironmentsService, private logService: ActivityLogService) {
    this.baseUrl = envService.apiUrl + this.serviceName;
  }

  selectDataTable(content) {
    this.logService.addActivityLog({nameMenu: 'game', action: 'show', nameModule: 'game'}).subscribe();
    return this.http.post<any>(this.baseUrl + '/select-data-table', content);
  }

  getResultOfQuaySo(content) {
    return this.http.post<any>(this.baseUrl + '/get-result-of-quay-so', content, {
      reportProgress: true,
      observe: 'events'
    });
  }

  getGameConfig() {
    return this.http.post<any>(this.baseUrl + '/get-game-config', {});
  }
}
