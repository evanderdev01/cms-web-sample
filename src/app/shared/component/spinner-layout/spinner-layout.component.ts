import {Component} from '@angular/core';
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-spinner-layout',
  template: `
    <ngx-spinner bdColor="rgba(0, 0, 0, 0.8)" size="medium" color="#fff" type="ball-climbing-dot"
                 [fullScreen]="true">
      <p style="font-size: 20px; color: white">Loading...</p>
    </ngx-spinner>
  `,
  styles: []
})
export class SpinnerLayoutComponent {
  constructor(private spinner: NgxSpinnerService) {}
}
