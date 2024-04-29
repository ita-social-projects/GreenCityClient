import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { HabitService } from '@global-service/habit/habit.service';
import { ShoppingList } from '@global-user/models/shoppinglist.interface';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TodoStatus } from '../../models/todo-status.enum';

import { HabitEditShoppingListComponent } from './habit-edit-shopping-list.component';
import { ShoppingListService } from './shopping-list.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

describe('HabitEditShoppingListComponent', () => {
  let component: HabitEditShoppingListComponent;
  let fixture: ComponentFixture<HabitEditShoppingListComponent>;
  let snackBar: MatSnackBar;

  const mockActivatedRoute = {
    params: of({ habitId: 2 })
  };
  const mockList: ShoppingList[] = [
    {
      id: 1,
      status: TodoStatus.active,
      text: 'Item 1',
      selected: false
    },
    {
      id: 2,
      status: TodoStatus.active,
      text: 'Item 2',
      selected: false
    }
  ];
  const mockItem: ShoppingList = {
    id: 234,
    status: TodoStatus.active,
    text: 'Item 2',
    selected: false
  };

  const mockText1 = 'This text does not contain any urls';
  const mockText2 = 'This text contains http://softserveinc.com/ link';
  const mockText3 = 'This text contains https://softserveinc.com/ link';

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HabitEditShoppingListComponent],
      imports: [HttpClientTestingModule, TranslateModule.forRoot(), MatSnackBarModule, ReactiveFormsModule],
      providers: [ShoppingListService, HabitService, { provide: ActivatedRoute, useValue: mockActivatedRoute }, MatSnackBar]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HabitEditShoppingListComponent);
    component = fixture.componentInstance;
    snackBar = TestBed.inject(MatSnackBar);
    fixture.detectChanges();
    component.shopList = [];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('bindLang(lang) should invoke translate.setDefaultLang(lang)', () => {
    spyOn((component as any).translate, 'setDefaultLang').and.returnValue('test');
    (component as any).bindLang('en');
    expect((component as any).translate.setDefaultLang).toHaveBeenCalledWith('en');
  });

  it('truncateShoppingItemName should return shortened string', () => {
    const name = component.truncateShoppingItemName('Very long name of shopping list item');
    expect(name).toBe('Very long name of sh...');
  });

  it('truncateShoppingItemName should not shorten small string', () => {
    const name = component.truncateShoppingItemName('String');
    expect(name).toBe('String');
  });

  it('truncateShoppingItemName should check small string', () => {
    const name = 'String';
    const result = component.truncateShoppingItemName(name);
    expect(result).toBe(name);
  });

  it('truncateShoppingItemName should change long string', () => {
    const name = 'Very loooooooong string';
    const result = component.truncateShoppingItemName(name);
    expect(result).not.toBe(name);
  });

  it('should call placeItemInOrder on additem', () => {
    const spy = spyOn(component as any, 'placeItemInOrder');
    component.addItem('test');
    expect(spy).toHaveBeenCalled();
  });

  it('should add item to shop list on additem', () => {
    const newList = [
      {
        id: null,
        status: TodoStatus.active,
        text: 'test',
        custom: true,
        selected: true
      }
    ];
    component.shopList = [];
    component.addItem('test');
    expect(component.shopList).toEqual(newList);
  });

  it('should setValue empty string on add item', () => {
    component.item.setValue('test');
    component.addItem('test');
    expect(component.item.value).toBe('');
  });

  it('should call placeItemInOrder on selectItem', () => {
    const spy = spyOn(component as any, 'placeItemInOrder');
    component.selectItem(mockItem);
    expect(spy).toHaveBeenCalled();
  });

  it('should delete item from shopList on deleteItem', () => {
    component.shopList = mockList;
    component.deleteItem('Item 1');
    expect(component.shopList).toEqual([mockList[1]]);
  });

  it('should return disableCheck if isAcquired is true', () => {
    component.isAcquired = true;
    const result = component.getCheckIcon({} as ShoppingList);
    expect(result).toBe(component.img.disableCheck);
  });

  it('should return doneCheck if item status is done', () => {
    const item: ShoppingList = { status: TodoStatus.done, text: mockText1, id: null };
    const result = component.getCheckIcon(item);
    expect(result).toBe(component.img.doneCheck);
  });

  it('should return minusCheck if item is selected', () => {
    const item: ShoppingList = { selected: true, status: TodoStatus.inprogress, text: mockText2, id: null };
    const result = component.getCheckIcon(item);
    expect(result).toBe(component.img.minusCheck);
  });

  it('should return plusCheck if item is not selected and status is not done', () => {
    const item: ShoppingList = { selected: false, status: TodoStatus.inprogress, text: mockText3, id: null };
    const result = component.getCheckIcon(item);
    expect(result).toBe(component.img.plusCheck);
  });

  it('should select item and change status to in progress if selected', () => {
    const item: ShoppingList = mockList[0];
    component.shopList = [item];
    component.selectItem(item);
    expect(component.shopList[0].selected).toBe(true);
    expect(component.shopList[0].status).toBe(TodoStatus.inprogress);
  });

  it('should deselect item and change status to active if not selected', () => {
    const item: ShoppingList = { id: null, status: TodoStatus.inprogress, text: 'item1', selected: true };
    component.shopList = [item];
    component.selectItem(item);
    expect(component.shopList[0].selected).toBe(false);
    expect(component.shopList[0].status).toBe(TodoStatus.active);
  });

  it('should move selected item to the top of the list', () => {
    component.shopList = mockList;
    component.selectItem(mockList[1]);
    expect(component.shopList[0]).toBe(mockList[1]);
    expect(component.shopList[1]).toBe(mockList[0]);
  });

  it('should not open snackbar if form is valid', () => {
    component.itemForm = new FormGroup({ item: new FormControl('Short item name') });
    const snackBarSpy = spyOn(snackBar, 'open');
    component.checkItemValidity();
    expect(snackBarSpy).not.toHaveBeenCalled();
  });

  it('ngOnDestroy should unsubscribe from subscription', () => {
    spyOn((component as any).langChangeSub, 'unsubscribe');
    component.ngOnDestroy();
    expect((component as any).langChangeSub.unsubscribe).toHaveBeenCalled();
  });
});
