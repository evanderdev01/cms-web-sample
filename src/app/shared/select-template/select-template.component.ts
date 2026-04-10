import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-select-template',
  template: `
    <ng-select [items]="items" [bindLabel]="bindLabel" [bindValue]="bindValue"
               [placeholder]="placeholder" [(ngModel)]="selectedValue"
               (change)="onChange($event)">
    </ng-select>
  `,
  styles: []
})
export class SelectTemplateComponent {
  @Input() items: any[] = [];
  @Input() bindLabel: string = 'label';
  @Input() bindValue: string = 'value';
  @Input() placeholder: string = 'Select...';
  @Input() selectedValue: any;
  @Output() selectedValueChange = new EventEmitter<any>();

  onChange(event) {
    this.selectedValueChange.emit(event);
  }
}
