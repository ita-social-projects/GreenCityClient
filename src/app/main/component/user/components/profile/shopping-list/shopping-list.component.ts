import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription, Subject } from 'rxjs';

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

  constructor(
    private localStorageService: LocalStorageService,
    private shopListService: ShoppingListService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.userId = this.localStorageService.getUserId();
    this.shopListService
      .getCustomShopList(this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: ShoppingList[]) => {
        res.forEach((el) => (el.custom = true));
        this.shoppingList = res;
        this.getShoppingList();
      });
  }

  private getShoppingList(): void {
    this.shopListService
      .getShopList(this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: ShoppingList[]) => {
        this.shoppingList = [...this.shoppingList, ...res];
      });
  }

  public openCloseList(): void {
    this.toggle = !this.toggle;
  }

  public toggleDone(item: ShoppingList): void {
    item.status = item.status === 'INPROGRESS' ? 'DONE' : 'INPROGRESS';
    item.custom ? this.updateStatusCustomItem(item) : this.updateStatusItem(item);
  }

  private updateStatusItem(item: ShoppingList): void {
    this.shopListService
      .updateStatusShopItem(item)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.updateShopList(item);
      });
  }

  private updateStatusCustomItem(item: ShoppingList): void {
    this.shopListService
      .updateStatusCustomShopItem(this.userId, item)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateShopList(item);
      });
  }

  private updateShopList(item: ShoppingList): void {
    this.shoppingList = this.shoppingList.map((el) => (el.id === item.id ? { ...el, status: item.status } : el));
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
