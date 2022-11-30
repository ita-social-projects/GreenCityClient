import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ShoppingList } from '@global-user/models/shoppinglist.model';
import { ShoppingListService } from './shopping-list.service';
import { ActivatedRoute } from '@angular/router';
import { HabitService } from '@global-service/habit/habit.service';
import { take, takeUntil } from 'rxjs/operators';
import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { HabitAssignInterface } from 'src/app/main/interface/habit/habit-assign.interface';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-habit-edit-shopping-list',
  templateUrl: './habit-edit-shopping-list.component.html',
  styleUrls: ['./habit-edit-shopping-list.component.scss']
})
export class HabitEditShoppingListComponent implements OnInit, OnDestroy {
  public itemForm = new FormGroup({
    item: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)])
  });
  public list: ShoppingList[] = [];
  public subscription: Subscription;
  public habitId: number;
  private destroySub: Subject<boolean> = new Subject<boolean>();
  private langChangeSub: Subscription;
  public shoppingItemNameLimit = 12;
  public seeAllShopingList: boolean;
  public minNumberOfItems = 3;

  public img = {
    arrowDown: 'assets/img/comments/arrow_down.png',
    arrowUp: 'assets/img/comments/arrow_up.png',
    back: 'assets/img/comments/reply.png'
  };

  @Output() newList = new EventEmitter<ShoppingList[]>();

  constructor(
    public shoppinglistService: ShoppingListService,
    private route: ActivatedRoute,
    private habitService: HabitService,
    private habitAssignService: HabitAssignService,
    private localStorageService: LocalStorageService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.subscribeToLangChange();
    this.route.params.subscribe((params) => {
      this.habitId = +params.habitId;
    });
    this.checkIfAssigned();
    this.subscription = this.shoppinglistService
      .getList()
      .pipe(takeUntil(this.destroySub))
      .subscribe((data) => {
        this.list = data;
        this.newList.emit(this.list);
      });
  }

  getListItems(isAssigned: boolean) {
    isAssigned ? this.getCustomItems() : this.getDefaultItems();
    this.getDefaultItems();
  }

  public truncateShoppingItemName(name: string) {
    if (name.length >= this.shoppingItemNameLimit) {
      return name.slice(0, this.shoppingItemNameLimit) + '...';
    }

    return name;
  }

  public getDefaultItems() {
    this.habitService
      .getHabitById(this.habitId)
      .pipe(take(1))
      .subscribe((habit) => {
        this.shoppinglistService.fillList(habit.shoppingListItems);
      });
  }

  public getCustomItems() {
    this.shoppinglistService.getCustomItems(localStorage.getItem('userId'), this.habitId);
  }

  private bindLang(lang: string): void {
    this.translate.setDefaultLang(lang);
  }

  private subscribeToLangChange(): void {
    this.langChangeSub = this.localStorageService.languageSubject.subscribe((lang) => {
      this.bindLang(lang);
      this.checkIfAssigned();
    });
  }

  public openCloseList() {
    this.seeAllShopingList = !this.seeAllShopingList;
  }

  public checkIfAssigned() {
    this.habitAssignService
      .getAssignedHabits()
      .pipe(take(1))
      .subscribe((response: Array<HabitAssignInterface>) => {
        response.some((assigned) => assigned.habit.id === this.habitId) ? this.getListItems(true) : this.getListItems(false);
      });
  }

  public add(value: string) {
    this.shoppinglistService.addItem(value);
    this.itemForm.setValue({ item: '' });
  }

  public delete(item) {
    this.shoppinglistService.deleteItem(item);
  }

  public select(item) {
    this.shoppinglistService.select(item);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.langChangeSub.unsubscribe();
    this.destroySub.next(true);
    this.destroySub.complete();
  }
}
