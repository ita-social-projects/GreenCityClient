import { Component, ElementRef, HostListener, Inject, Input, OnInit, TemplateRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-column-filters-pop-up',
  templateUrl: './column-filters-pop-up.component.html',
  styleUrls: ['./column-filters-pop-up.component.scss']
})
export class ColumnFiltersPopUpComponent implements OnInit {
  isPopupOpened = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialogRef: MatDialogRef<ColumnFiltersPopUpComponent>,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.setPopupPosUnderButton();
    console.log(this.data);
  }

  @HostListener('document:click', ['$event'])
  public onClick(event: any) {
    const clickedInside = this.matDialogRef.componentInstance.elementRef.nativeElement.contains(event.target);

    if (!clickedInside && this.isPopupOpened) {
      this.matDialogRef.close();
    }

    if (!this.isPopupOpened) {
      this.isPopupOpened = true;
    }
  }

  private setPopupPosUnderButton() {
    const rect = this.data.trigger.nativeElement.getBoundingClientRect();
    let position = { left: `${rect.left}px`, top: `${rect.top + rect.height}px` };

    if (rect.left + this.data.width > document.body.clientWidth) {
      position.left = `${rect.left + rect.width - this.data.width}px`;
    }
    this.matDialogRef.updatePosition(position);
    this.matDialogRef.updateSize(`${this.data.width}px`, `${this.data.height}px`);
  }

  changeColumnFilters(checked, curColumn, option) {
    const elem = {};
    const columnName = this.data.columnName;
    this.data.columnsForFiltering.find((column) => {
      if (column.key === curColumn.title.key) {
        column.values.find((value) => {
          if (value.key === option.key) {
            value.filtered = checked;
          }
        });
      }
    });
    if (checked) {
      elem[columnName] = option.key;
      this.data.filters.push(elem);
    } else {
      this.data.filters = this.data.filters.filter((filteredElem) => filteredElem[columnName] !== option.key);
    }
  }
}
