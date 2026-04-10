import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-health',
  templateUrl: './health.component.html',
  styleUrls: ['./health.component.scss']
})
export class HealthComponent implements OnInit {
  response: any;

  constructor() {
  }

  ngOnInit(): void {
    this.healthCheck();
  }

  healthCheck(): any {
    this.response = 'OK';
    return this.response;
  }
}
