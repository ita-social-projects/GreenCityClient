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

describe('HabitEditShoppingListComponent', () => {
  let component: HabitEditShoppingListComponent;
  let fixture: ComponentFixture<HabitEditShoppingListComponent>;

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
      imports: [HttpClientTestingModule, TranslateModule.forRoot(), MatSnackBarModule],
      providers: [ShoppingListService, HabitService, { provide: ActivatedRoute, useValue: mockActivatedRoute }, MatSnackBar]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HabitEditShoppingListComponent);
    component = fixture.componentInstance;
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

  it('should setValue empty string on additem', () => {
    component.item.setValue('test');
    component.addItem('test');
    expect(component.item.value).toBe('');
  });

  it('should call placeItemInOrder on selectItem', () => {
    const spy = spyOn(component as any, 'placeItemInOrder');
    component.selectItem(mockItem);
    expect(spy).toHaveBeenCalled();
  });

  it('shoulddelete item from shopList on deleteItem', () => {
    component.shopList = mockList;
    component.deleteItem('Item 1');
    expect(component.shopList).toEqual([mockList[1]]);
  });

  it('ngOnDestroy should unsubscribe from subscription', () => {
    spyOn((component as any).langChangeSub, 'unsubscribe');
    component.ngOnDestroy();
    expect((component as any).langChangeSub.unsubscribe).toHaveBeenCalled();
  });
});
