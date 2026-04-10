import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-pagination-template',
  templateUrl: './pagination-template.component.html',
  styleUrls: ['./pagination-template.component.scss']
})
export class PaginationTemplateComponent implements OnInit {
  itemPerPageList = [5, 10, 15, 20, 25, 30];
  page = 1;
  @Input() maxSize = 7;
  @Input() total: any;
  @Input() itemPerPage = 10;
  @Input() showPerPage = true;
  @Output() pageEvent: EventEmitter<any> = new EventEmitter();
  @Output() itemPerPageEvent: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  selectPage(e) {
    this.page = e;
    this.pageEvent.emit(this.page);
  }

  selectItemPerPage(e) {
    this.itemPerPage = e;
    this.itemPerPageEvent.emit(e);
    this.selectPage(1);
  }
}
