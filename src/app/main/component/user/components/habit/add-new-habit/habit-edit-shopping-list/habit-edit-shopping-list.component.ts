import { Component, EventEmitter, OnDestroy, OnInit, Output, Input, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ShoppingList } from '@global-user/models/shoppinglist.model';
import { ShoppingListService } from './shopping-list.service';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-habit-edit-shopping-list',
  templateUrl: './habit-edit-shopping-list.component.html',
  styleUrls: ['./habit-edit-shopping-list.component.scss']
})
export class HabitEditShoppingListComponent implements OnInit, AfterViewChecked, OnDestroy {
  @Input() shopList: ShoppingList[] = [];
  @Input() isAcquired: boolean = false;
  @Input() isEditing: boolean = false;

  public itemForm = new FormGroup({
    item: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)])
  });
  public subscription: Subscription;
  public habitId: number;
  public userId: number;
  private destroySub: Subject<boolean> = new Subject<boolean>();
  private langChangeSub: Subscription;
  public shoppingItemNameLimit = 20;
  public seeAllShopingList: boolean;
  public minNumberOfItems = 3;

  public img = {
    doneCheck: 'assets/icons/habits/filled-check-circle.svg',
    inprogressCheck: 'assets/icons/habits/lined-green-circle.svg',
    plusCheck: 'assets/icons/habits/doted-plus-green-circle.svg',
    minusCheck: 'assets/icons/habits/doted-minus-green-circle.svg',
    disableCheck: 'assets/icons/habits/circle-grey.svg'
  };

  @Output() newList = new EventEmitter<ShoppingList[]>();

  constructor(
    public shoppinglistService: ShoppingListService,
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.subscribeToLangChange();
    this.route.params.subscribe((params) => {
      this.habitId = +params.habitId;
    });
    this.userId = this.localStorageService.getUserId();
  }

  ngAfterViewChecked(): void {
    if (this.shopList && this.isEditing) {
      this.shopList.forEach((el) => (el.selected = el.status === 'INPROGRESS'));
    }
    this.cdr.detectChanges();
  }

  get item(): AbstractControl {
    return this.itemForm.get('item');
  }

  public truncateShoppingItemName(name: string): string {
    if (name.length >= this.shoppingItemNameLimit) {
      return name.slice(0, this.shoppingItemNameLimit) + '...';
    }

    return name;
  }

  private bindLang(lang: string): void {
    this.translate.setDefaultLang(lang);
  }

  private subscribeToLangChange(): void {
    this.langChangeSub = this.localStorageService.languageSubject.subscribe((lang) => {
      this.bindLang(lang);
    });
  }

  public getCheckIcon(item: ShoppingList): string {
    if (this.isAcquired) {
      return this.img.disableCheck;
    }
    if (item.status === 'DONE') {
      return this.img.doneCheck;
    }
    return item.selected ? this.img.inprogressCheck : this.img.plusCheck;
  }

  public addItem(value: string): void {
    const newItem = {
      id: null,
      status: 'ACTIVE',
      text: value,
      custom: true,
      selected: true
    };
    this.shopList = [newItem, ...this.shopList];
    this.item.setValue('');
    this.placeItemInOrder();
  }

  public selectItem(item: ShoppingList): void {
    this.shopList = this.shopList.map((element) => {
      if (element.text === item.text) {
        element.selected = !item.selected;
        element.status = item.selected ? 'INPROGRESS' : 'ACTIVE';
      }
      return element;
    });
    if (item.selected) {
      const index = this.shopList.indexOf(item);
      this.shopList.splice(index, 1);
      this.shopList = [item, ...this.shopList];
    }
    this.placeItemInOrder();
  }

  private placeItemInOrder(): void {
    const customSelectedItems = this.shopList.filter((element) => element.custom && element.selected);
    const selectedItems = this.shopList.filter((element) => !element.custom && element.selected);
    const unselectedItems = this.shopList.filter((element) => !element.selected);
    this.shopList = [...customSelectedItems, ...selectedItems, ...unselectedItems];
    this.newList.emit(this.shopList);
  }

  public deleteItem(text: string): void {
    this.shopList = this.shopList.filter((elem) => elem.text !== text);
    this.newList.emit(this.shopList);
  }

  ngOnDestroy(): void {
    this.langChangeSub.unsubscribe();
    this.destroySub.next(true);
    this.destroySub.complete();
  }
}
