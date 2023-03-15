import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Subject } from 'rxjs';

import { ProfileService } from './../profile-service/profile.service';
import { ShoppingList } from '@global-user/models/shoppinglist.model';
import { ShoppingListService } from '@global-user/components/habit/add-new-habit/habit-edit-shopping-list/shopping-list.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';

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
  private userId: number;

  constructor(private profileService: ProfileService, private localStorageService: LocalStorageService) {}

  ngOnInit() {
    this.userId = this.localStorageService.getUserId();
    this.profileService
      .getCustomShoppingList(this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: ShoppingList[]) => {
        res.forEach((el) => (el.custom = true));
        this.shoppingList = res;
        this.getShoppingList();
      });
  }

  private getShoppingList(): void {
    this.profileService
      .getShoppingList(this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: ShoppingList[]) => {
        this.shoppingList = [...this.shoppingList, ...res];
      });
  }

  public openCloseList() {
    this.toggle = !this.toggle;
  }

  public toggleDone(item: ShoppingList): void {
    item.custom ? this.updateStatusCustomItem(item) : this.updateStatusItem(item);
  }

  private updateStatusItem(item: ShoppingList): void {
    this.profileService
      .updateStatusShopItem(item)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateDataOnUi(item);
      });
  }

  private updateStatusCustomItem(item: ShoppingList): void {
    this.profileService
      .updateStatusCustomShopItem(item)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateDataOnUi(item);
      });
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
