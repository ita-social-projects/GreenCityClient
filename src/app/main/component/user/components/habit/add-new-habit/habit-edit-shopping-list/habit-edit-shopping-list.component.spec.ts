import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { HabitService } from '@global-service/habit/habit.service';
import { ShoppingList } from '@global-user/models/shoppinglist.model';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { HabitEditShoppingListComponent } from './habit-edit-shopping-list.component';
import { ShoppingListService } from './shopping-list.service';

describe('HabitEditShoppingListComponent', () => {
  let component: HabitEditShoppingListComponent;
  let fixture: ComponentFixture<HabitEditShoppingListComponent>;

  const mockActivatedRoute = {
    params: of({ habitId: 2 })
  };
  let mockList: ShoppingList[] = [
    {
      id: 1,
      status: 'INPROGRESS',
      text: 'Item 1',
      selected: false
    },
    {
      id: 2,
      status: 'ACTIVE',
      text: 'Item 2',
      selected: false
    }
  ];
  const mockItem: ShoppingList = {
    id: 234,
    status: 'ACTIVE',
    text: 'Item 2',
    selected: false
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HabitEditShoppingListComponent],
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [ShoppingListService, HabitService, { provide: ActivatedRoute, useValue: mockActivatedRoute }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HabitEditShoppingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('bindLang(lang) should invoke translate.setDefaultLang(lang)', () => {
    spyOn((component as any).translate, 'setDefaultLang').and.returnValue('test');
    (component as any).bindLang('en');
    expect((component as any).translate.setDefaultLang).toHaveBeenCalledWith('en');
  });

  it('getListItems should invoke getDefaultItems method', () => {
    const isAssigned = false;
    spyOn(component, 'getDefaultItems').and.returnValue();
    component.getListItems(isAssigned);
    expect(component.getDefaultItems).toHaveBeenCalled();
  });

  it('getListItems should invoke getCustomItems() method', () => {
    const isAssigned = true;
    spyOn(component, 'getCustomItems').and.returnValue();
    component.getListItems(isAssigned);
    expect(component.getCustomItems).toHaveBeenCalled();
  });

  it('getCustomItems should invoke shoppinglistService.getCustomItems method', () => {
    spyOn(component.shoppinglistService, 'getCustomItems');
    component.getCustomItems();
    expect(component.shoppinglistService.getCustomItems).toHaveBeenCalled();
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

  it('openCloseList should change toggle status', () => {
    component.seeAllShopingList = false;
    component.openCloseList();
    expect(component.seeAllShopingList).toBe(true);
  });

  it('select() should change status of shopping list item', () => {
    const item = mockItem;
    component.shoppinglistService.fillList(mockList);
    component.select(item);
    expect(component.list[0].selected).toBeTruthy();
  });

  it('fillList() should fill the list', () => {
    component.shoppinglistService.fillList(mockList);
    expect(component.list[0].text).toEqual('Item 1');
  });

  it('addItem() should add new item to the list', () => {
    component.shoppinglistService.fillList(mockList);
    component.shoppinglistService.addItem('New Item');
    expect(component.list[0].text).toEqual('New Item');
  });

  it('deleteItem() should delete item from the list', () => {
    const item = {
      text: 'Item 1'
    };
    component.shoppinglistService.fillList(mockList);
    component.shoppinglistService.deleteItem(item);
    expect(component.list[0].text).not.toBe('Item 1');
  });

  it('ngOnDestroy should unsubscribe from subscription', () => {
    spyOn((component as any).langChangeSub, 'unsubscribe');
    component.ngOnDestroy();
    expect((component as any).langChangeSub.unsubscribe).toHaveBeenCalled();
  });

  it('ngOnDestroy should unsubscribe from subscription', () => {
    spyOn((component as any).subscription, 'unsubscribe');
    component.ngOnDestroy();
    expect((component as any).subscription.unsubscribe).toHaveBeenCalled();
  });
});
