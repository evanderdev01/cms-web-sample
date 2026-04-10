import { Component, OnInit } from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-apidoc',
  templateUrl: './apidoc.component.html',
  styleUrls: ['./apidoc.component.scss']
})
export class ApidocComponent implements OnInit {
  link: any;

  constructor(public sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.link = this.sanitizer.bypassSecurityTrustResourceUrl('assets/apidoc/index.html');
  }

}
