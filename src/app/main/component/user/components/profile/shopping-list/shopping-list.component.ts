import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';

import { ShoppingList } from '@global-user/models/shoppinglist.model';
import { ShoppingListService } from '@global-user/components/habit/add-new-habit/habit-edit-shopping-list/shopping-list.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subscription } from 'stompjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  public shoppingList: ShoppingList[] = [];
  public toggle: boolean;
  private userId: number;
  private currentLang: string;
  public profileSubscription: Subscription;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private localStorageService: LocalStorageService,
    private shopListService: ShoppingListService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userId = this.localStorageService.getUserId();
    this.subscribeToLangChange();
  }

  private subscribeToLangChange(): void {
    this.localStorageService.languageBehaviourSubject.subscribe((lang: string) => {
      this.currentLang = lang;
      this.getCustomShopList();
    });
  }

  private getCustomShopList(): void {
    this.shopListService
      .getCustomShopList(this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: ShoppingList[]) => {
        this.shoppingList = res.filter((el) => el.status === 'INPROGRESS'); //will be removed after add new GET on backend
        this.shoppingList.forEach((el) => (el.custom = true));
        this.getShoppingList();
      });
  }

  private getShoppingList(): void {
    this.shopListService
      .getShopList(this.userId, this.currentLang)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: ShoppingList[]) => {
        this.shoppingList = [...this.shoppingList, ...res];
        this.shoppingList = this.shoppingList.map((el) => (el.status === 'DONE' ? { ...el, selected: true } : el));
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
      .updateStandardShopItemStatus(item, this.currentLang)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateShopList(item);
      });
  }

  private updateStatusCustomItem(item: ShoppingList): void {
    this.shopListService
      .updateCustomShopItemStatus(this.userId, item)
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
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
