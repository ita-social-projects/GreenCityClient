import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-ubs-admin-order-history',
  templateUrl: './ubs-admin-order-history.component.html',
  styleUrls: ['./ubs-admin-order-history.component.scss']
})
export class UbsAdminOrderHistoryComponent implements OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>();
  pageOpen: boolean;
  constructor() {}

  openDetails() {
    this.pageOpen = !this.pageOpen;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
