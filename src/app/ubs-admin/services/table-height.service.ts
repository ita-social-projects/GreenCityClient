import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TableHeightService {
  setTableHeightToContainerHeight(table, tableContainer) {
    if (table) {
      let isHeightSet: boolean;
      const tableHeight = table.getBoundingClientRect().height;
      const tableContainerHeight = this.setTableContainerHeight(tableContainer).getBoundingClientRect().height;
      // if (tableHeight < tableContainerHeight) {
      //   this.onScroll();
      // } else {
      //   this.isTableHeightSet = true;
      // }
      isHeightSet = tableHeight < tableContainerHeight ? false : true;
      return isHeightSet;
    }
  }

  private setTableContainerHeight(tableContainer) {
    tableContainer.style.height = document.documentElement.clientHeight - tableContainer.getBoundingClientRect().y + 'px';
    return tableContainer;
  }
}
