import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ShoppingListComponent } from './shopping-list.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { of, BehaviorSubject } from 'rxjs';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ShoppingListService } from '@global-user/components/habit/add-new-habit/habit-edit-shopping-list/shopping-list.service';
import { AllShoppingLists, ShoppingList } from '@global-user/models/shoppinglist.model';
import { Language } from 'src/app/main/i18n/Language';

describe('ShoppingListComponent', () => {
  let component: ShoppingListComponent;
  let fixture: ComponentFixture<ShoppingListComponent>;

  const mockShopItem: ShoppingList = {
    id: 4,
    status: 'INPROGRESS',
    text: 'some to-do task'
  };

  const mockShopList: ShoppingList[] = [
    {
      id: 1,
      status: 'INPROGRESS',
      text: 'some to-do'
    }
  ];

  const mockShopLists: AllShoppingLists[] = [
    {
      userShoppingListItemDto: [],
      customShoppingListItemDto: [
        {
          id: 2,
          status: 'DONE',
          text: 'some to-do 2'
        }
      ]
    }
  ];

  const localStorageServiceMock = jasmine.createSpyObj('localStorageService', [
    'languageBehaviourSubject',
    'getCurrentLanguage',
    'getUserId'
  ]);
  localStorageServiceMock.languageBehaviourSubject = new BehaviorSubject('ua');
  localStorageServiceMock.getCurrentLanguage = () => 'en' as Language;
  localStorageServiceMock.languageSubject = of('en');
  localStorageServiceMock.getUserId = () => 1;

  const shoppingListServiceMock: ShoppingListService = jasmine.createSpyObj('fakeShoppingListService', [
    'getUserShoppingLists',
    'updateStandardShopItemStatus',
    'updateCustomShopItemStatus'
  ]);
  shoppingListServiceMock.getUserShoppingLists = () => of(mockShopLists);
  shoppingListServiceMock.updateStandardShopItemStatus = () => of();
  shoppingListServiceMock.updateCustomShopItemStatus = () => of();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShoppingListComponent],
      imports: [RouterTestingModule, HttpClientTestingModule, TranslateModule.forRoot(), BrowserAnimationsModule, NoopAnimationsModule],
      providers: [
        { provide: ShoppingListService, useValue: shoppingListServiceMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call subscribeToLangChange method onInit', () => {
    const spy = spyOn(component as any, 'subscribeToLangChange');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should call getAllShopLists on subscribeToLangChange', () => {
    const spy = spyOn(component as any, 'getAllShopLists');
    (component as any).subscribeToLangChange();
    expect(spy).toHaveBeenCalled();
  });

  it('should set custom true after getShopLists', () => {
    const result = [
      {
        id: 1,
        status: 'INPROGRESS',
        text: 'some to-do',
        custom: true
      }
    ];
    mockShopList.forEach((el) => (el.custom = true));
    component.shoppingList = mockShopList;
    expect(component.shoppingList).toEqual(result);
  });

  it('should set shopList after getShopList', () => {
    component.shoppingList = [];
    component.shoppingList = [...component.shoppingList, ...mockShopList];
    expect(component.shoppingList).toEqual(mockShopList);
  });

  it('should change toogle from true on openCloseList', () => {
    component.toggle = true;
    component.openCloseList();
    expect(component.toggle).toBeFalsy();
  });

  it('should change toogle from false on openCloseList', () => {
    component.toggle = false;
    component.openCloseList();
    expect(component.toggle).toBeTruthy();
  });

  it('should change item status on toggleDone', () => {
    mockShopItem.status = 'INPROGRESS';
    component.toggleDone(mockShopItem);
    expect(mockShopItem.status).toBe('DONE');
  });

  it('should call updateStatusItem on toggleDone', () => {
    mockShopItem.custom = false;
    const spy = spyOn(component as any, 'updateStatusItem');
    component.toggleDone(mockShopItem);
    expect(spy).toHaveBeenCalled();
  });

  it('should call updateStatusCustomItem on toggleDone', () => {
    mockShopItem.custom = true;
    const spy = spyOn(component as any, 'updateStatusCustomItem');
    component.toggleDone(mockShopItem);
    expect(spy).toHaveBeenCalled();
  });

  it('should call updateStatusCustomItem on updateStatusCustomItem', () => {
    const spy = spyOn(component as any, 'updateStatusCustomItem');
    (component as any).updateStatusCustomItem(mockShopItem);
    expect(spy).toHaveBeenCalledWith(mockShopItem);
  });
});
