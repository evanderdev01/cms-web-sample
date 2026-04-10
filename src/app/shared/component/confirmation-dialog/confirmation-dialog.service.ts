import {Injectable} from '@angular/core';

@Injectable()
export class ConfirmationDialogService {

  confirm(title: string, message: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const result = window.confirm(message);
      resolve(result);
    });
  }
}
