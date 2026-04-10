import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-select-template',
  templateUrl: './select-template.component.html',
  styleUrls: ['./select-template.component.scss']
})
export class SelectTemplateComponent implements OnInit {
  @Input() multiple: any;
  @Input() item: any;
  @Input() itemList: any;
  @Input() closeOnSelect = false;
  @Input() clearable = false;
  @Input() bindLabel = '';
  @Input() bindSubLabel = '';
  @Input() bindValue = '';
  @Input() label = '';
  @Input() class = 'custom';
  @Input() disabled = false;
  @Input() groupBy: any;
  @Input() hideValue = false;
  @Input() placeholder = '';
  @Output() dataEvent = new EventEmitter<any>();
  groupCheckbox: any = {};
  sumGroup: any = {};
  lengthGroup = 0;

  constructor() {
  }

  ngOnInit(): void {
    if (this.groupBy && this.itemList) {
      this.itemList.forEach(i => {
        if (this.sumGroup[i[this.groupBy]]) {
          this.sumGroup[i[this.groupBy]].push(i[this.bindValue]);
        } else {
          this.sumGroup[i[this.groupBy]] = [i[this.bindValue]];
        }
        this.groupCheckbox[i[this.groupBy]] = false;
      })
      Object.keys(this.groupCheckbox).forEach((key) => this.lengthGroup = this.lengthGroup + 1);
    }
  }

  selectAll() {
    if (this.bindValue && this.bindValue.trim() !== '') {
      this.item = this.itemList.map((item: any) => item[this.bindValue]);
      if (this.groupBy) {
        Object.keys(this.groupCheckbox).forEach(key => {
          this.groupCheckbox[key] = true;
        })
      }
    } else {
      this.item = this.itemList;
    }
    this.dataEvent.emit(this.item);
  }

  clearAll() {
    this.item = [];
    if (this.groupBy) {
      Object.keys(this.groupCheckbox).forEach(key => {
        this.groupCheckbox[key] = false;
      })
    }
    this.dataEvent.emit(this.item);
  }

  selectEvent(e: any) {
    if (e && !e.target) {
      if (this.groupBy) {
        const a: any = {};
        this.item.forEach(i => {
          Object.keys(this.sumGroup).forEach(key => {
            if (this.sumGroup[key].includes(i)) {
              if (a[key]) {
                a[key].push(i);
              } else {
                a[key] = [i];
              }
            }
          })
        })
        Object.keys(this.groupCheckbox).forEach(key => {
          if (a[key]) {
            this.groupCheckbox[key] = a[key].length === this.sumGroup[key].length;
          } else {
            this.groupCheckbox[key] = false;
          }
        })
      }
    }
    this.dataEvent.emit(this.item);
  }

  selectGroupEvent(e, str) {
    const list = this.sumGroup[str];
    if (e.target.checked) {
      this.item = this.item.filter(i => !list.includes(i)).concat(list);
      this.groupCheckbox[str] = true;
    } else {
      this.item = this.item.filter(i => !list.includes(i));
      this.groupCheckbox[str] = false;
    }
  }
}
