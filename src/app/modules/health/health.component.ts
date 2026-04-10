import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-health',
  template: `<div>{{response}}</div>`,
  styles: []
})
export class HealthComponent implements OnInit {
  response: any;

  constructor() {}

  ngOnInit(): void {
    this.healthCheck();
  }

  healthCheck(): any {
    this.response = 'OK';
    return this.response;
  }
}
