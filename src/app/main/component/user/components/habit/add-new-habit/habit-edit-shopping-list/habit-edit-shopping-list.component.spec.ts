import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { HabitService } from '@global-service/habit/habit.service';
import { ShoppingList } from '@global-user/models/shoppinglist.interface';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TodoStatus } from '../../models/todo-status.enum';

import { HabitEditShoppingListComponent } from './habit-edit-shopping-list.component';
import { ShoppingListService } from './shopping-list.service';
import { MatDialog } from '@angular/material/dialog';
import { SimpleChange, SimpleChanges } from '@angular/core';

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

  const matDialogRefMock = jasmine.createSpyObj(['open', 'afterClosed']);
  matDialogRefMock.open.and.returnValue({ afterClosed: () => of(true) });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HabitEditShoppingListComponent],
      imports: [HttpClientTestingModule, TranslateModule.forRoot(), MatSnackBarModule],
      providers: [
        ShoppingListService,
        HabitService,
        MatSnackBar,
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: MatDialog, useValue: matDialogRefMock }
      ]
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

  it('should call placeItemInOrder on additem', () => {
    component.isListChanged = false;
    const spy = spyOn(component as any, 'placeItemInOrder');
    component.addItem('test');
    expect(spy).toHaveBeenCalled();
    expect(component.isListChanged).toBeTruthy();
  });

  it('should set selected property on ngOnchange', () => {
    component.shopList = [];
    const spy = spyOn(component as any, 'placeItemInOrder');
    mockList.forEach((el) => {
      const { selected, ...newEl } = el;
      component.shopList.push(newEl);
    });
    const changes: SimpleChanges = {
      shopList: new SimpleChange(undefined, [], true)
    };
    component.ngOnChanges(changes);
    expect(component.shopList).toEqual(mockList);
    expect(spy).toHaveBeenCalled();
  });

  it('should add item to shop list on additem', () => {
    const newList = [
      {
        id: null,
        status: TodoStatus.inprogress,
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
    component.isListChanged = false;
    const spy = spyOn(component as any, 'placeItemInOrder');
    component.selectItem(mockItem);
    expect(component.isListChanged).toBeTruthy();
    expect(spy).toHaveBeenCalled();
  });

  it('should open confirmation dialog on deleteItem', () => {
    component.isListChanged = false;
    component.shopList = mockList;
    component.deleteItem('Item 1');
    expect((component as any).dialog.open).toHaveBeenCalled();
    expect(component.shopList).toEqual([mockList[1]]);
    expect(component.isListChanged).toBeTruthy();
  });

  it('should switch edit mode', () => {
    mockList.forEach((el) => (component as any).shopListBeforeEditing.push({ ...el }));
    component.shopList = [{ ...mockItem }];
    component.isEditMode = false;
    component.isListChanged = true;
    component.changeEditMode();
    expect((component as any).shopListBeforeEditing).toEqual(component.shopList);
    expect(component.isListChanged).toBeFalsy();
    expect(component.isEditMode).toBeTruthy();
  });

  it('should check isListItemsChanged', () => {
    (component as any).shopListBeforeEditing = mockList;
    component.shopList = [...mockList, mockItem];
    const result = (component as any).isListItemsChanged();
    expect(result).toBeTruthy();
  });

  it('should open dialog o close editing ', () => {
    (component as any).isEditMode = true;
    spyOn(component as any, 'isListItemsChanged').and.returnValue(true);
    component.cancelEditing();
    expect((component as any).dialog.open).toHaveBeenCalled();
    expect(component.isEditMode).toBeFalsy();
  });

  it('ngOnDestroy should unsubscribe from subscription', () => {
    spyOn((component as any).langChangeSub, 'unsubscribe');
    component.ngOnDestroy();
    expect((component as any).langChangeSub.unsubscribe).toHaveBeenCalled();
  });
});
