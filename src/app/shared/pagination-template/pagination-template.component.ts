import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-pagination-template',
  template: `
    <div class="d-flex justify-content-between align-items-center mt-2">
      <div>
        <span>Total: {{totalItems}}</span>
      </div>
      <pagination-controls (pageChange)="onPageChange($event)"
                           [maxSize]="5">
      </pagination-controls>
    </div>
  `,
  styles: []
})
export class PaginationTemplateComponent {
  @Input() totalItems: number = 0;
  @Output() pageChanged = new EventEmitter<number>();

  onPageChange(page: number) {
    this.pageChanged.emit(page);
  }
}
