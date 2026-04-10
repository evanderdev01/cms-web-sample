import {Injectable} from '@angular/core';

export enum Environment {
  Prod = 'prod',
  Staging = 'staging',
  Dev = 'dev',
  Local = 'local',
}

@Injectable({
  providedIn: 'root'
})
export class EnvironmentsService {
  private _env!: Environment;
  private _apiUrl!: string;
  private _downloadUrl!: string;
  private _encryptKey!: string;
  private _encryptIV!: string;

  constructor() {}

  init(): Promise<void> {
    return new Promise(resolve => {
      this.setEnvVariables();
      resolve();
    });
  }

  get env(): Environment {
    return this._env;
  }

  private setEnvVariables(): void {
    const hostname = window && window.location && window.location.hostname;

    if (hostname.includes('localhost')) {
      this._env = Environment.Local;
      this._apiUrl = 'https://api-dev.example.com';
      this._downloadUrl = 'https://api-dev.example.com';
    } else if (hostname === 'cms-dev.example.com') {
      this._env = Environment.Dev;
      this._apiUrl = 'https://api-dev.example.com';
      this._downloadUrl = 'https://api-dev.example.com';
    } else if (hostname === 'cms-stag.example.com') {
      this._env = Environment.Staging;
      this._apiUrl = 'https://api-stag.example.com';
      this._downloadUrl = 'https://api-stag.example.com';
    } else if (hostname === 'cms.example.com') {
      this._env = Environment.Prod;
      this._apiUrl = 'https://api.example.com';
      this._downloadUrl = 'https://api.example.com';
    } else {
      console.warn(`Cannot find environment for host name ${hostname}`);
    }

    // TODO: Replace with your own encryption key and IV
    this._encryptKey = 'YOUR_32_CHAR_ENCRYPTION_KEY_HERE';
    this._encryptIV = 'YOUR_16_CHAR_IV_';
  }

  get apiUrl(): string {
    return this._apiUrl;
  }

  get downloadUrl(): string {
    return this._downloadUrl;
  }

  get encryptKey(): string {
    return this._encryptKey;
  }

  get encryptIV(): string {
    return this._encryptIV;
  }
}
