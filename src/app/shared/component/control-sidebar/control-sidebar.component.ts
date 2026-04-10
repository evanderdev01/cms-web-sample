import {Component} from '@angular/core';
import {AuthService} from "../../../_services/auth/auth.service";

@Component({
  selector: 'app-control-sidebar',
  template: `
    <aside class="control-sidebar control-sidebar-dark">
      <div class="p-3">
        <h5>Settings</h5>
      </div>
    </aside>
  `,
  styles: []
})
export class ControlSidebarComponent {
  constructor(private authService: AuthService) {}
}
