import {Component} from '@angular/core';

@Component({
  selector: 'app-confirmation-dialog',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{title}}</h4>
    </div>
    <div class="modal-body">
      <p>{{message}}</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="decline()">Cancel</button>
      <button type="button" class="btn btn-primary" (click)="accept()">Confirm</button>
    </div>
  `,
  styles: []
})
export class ConfirmationDialogComponent {
  title: string;
  message: string;

  accept() {}
  decline() {}
}
