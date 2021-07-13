import { finalize, takeUntil } from 'rxjs/operators';
import { ProfileService } from './../profile-service/profile.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShoppingList } from '@global-user/models/shoppinglist.model';
import { Subscription, Subject } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  public shoppingList: ShoppingList[] = [];
  public profileSubscription: Subscription;
  private destroy$ = new Subject<void>();
  public toggle: boolean;
  constructor(private profileService: ProfileService) {}

  get shoppingListLength(): number {
    if (!this.shoppingList) {
      return 0;
    }
    return this.shoppingList.length;
  }

  ngOnInit() {
    this.getShoppingList();
  }

  public getShoppingList(): void {
    this.profileSubscription = this.profileService
      .getShoppingList()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          if (!this.shoppingList) {
            this.shoppingList = [];
          }
        })
      )
      .subscribe(
        (shoppingListArr: ShoppingList[]) => (this.shoppingList = shoppingListArr),
        (error) => (this.shoppingList = [])
      );
  }

  public openCloseList() {
    this.toggle = !this.toggle;
  }

  public toggleDone(item): void {
    this.profileService
      .toggleStatusOfShoppingItem(item)
      .pipe(takeUntil(this.destroy$))
      .subscribe((success) => this.updateDataOnUi(item));
  }

  private updateDataOnUi(item): any {
    const { status: prevItemStatus } = item;
    const newItemStatus = prevItemStatus === 'ACTIVE' ? 'DONE' : 'ACTIVE';
    item.status = newItemStatus;
    return item.status;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
