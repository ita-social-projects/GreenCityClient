import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ShoppingListService } from './shopping-list.service';
import { AllShoppingLists, CustomShoppingItem, HabitUpdateShopList, ShoppingList } from '@global-user/models/shoppinglist.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from '@environment/environment.js';

describe('ShoppingListService', () => {
  let service: ShoppingListService;
  let httpMock: HttpTestingController;

  const mainLink = environment.backendLink;

  const mockCustomItem: CustomShoppingItem = {
    text: 'New item'
  };

  const mockItem: ShoppingList = {
    id: 1,
    status: 'INPROGRESS',
    text: 'Item 1'
  };

  const mockList: ShoppingList[] = [
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

  const mockAllShopList: AllShoppingLists = {
    userShoppingListItemDto: [
      {
        id: 1,
        status: 'INPROGRESS',
        text: 'Item 1'
      }
    ],
    customShoppingListItemDto: [
      {
        id: 1,
        status: 'INPROGRESS',
        text: 'Item 1'
      }
    ]
  };

  const mockUpdateHabitList: HabitUpdateShopList = {
    habitId: 2,
    standartShopList: [
      {
        id: 1,
        status: 'INPROGRESS',
        text: 'Item 1'
      }
    ],
    customShopList: [
      {
        id: 2,
        status: 'INPROGRESS',
        text: 'Item 2'
      }
    ],
    lang: 'ua'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [ShoppingListService, TranslateService]
    });

    service = TestBed.inject(ShoppingListService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return shopList by userId and lang on gethopList', () => {
    service.getShopList(1, 'ua').subscribe((data) => {
      expect(data).toBe(mockList);
    });

    const req = httpMock.expectOne(`${mainLink}user/shopping-list-items/1/get-all-inprogress?lang=ua`);
    expect(req.request.responseType).toEqual('json');
    expect(req.request.method).toBe('GET');
    req.flush(mockList);
  });

  it('should return shopList by userId on getCustomShopList', () => {
    service.getCustomShopList(1).subscribe((data) => {
      expect(data).toBe(mockList);
    });

    const req = httpMock.expectOne(`${mainLink}custom/shopping-list-items/1/custom-shopping-list-items`);
    expect(req.request.responseType).toEqual('json');
    expect(req.request.method).toBe('GET');
    req.flush(mockList);
  });

  it('should return allShopList by habitId on getHabitAllShopLists', () => {
    service.getHabitAllShopLists(2, 'en').subscribe((data) => {
      expect(data).toBe(mockAllShopList);
    });

    const req = httpMock.expectOne(`${mainLink}habit/assign/2/allUserAndCustomList?lang=en`);
    expect(req.request.responseType).toEqual('json');
    expect(req.request.method).toBe('GET');
    req.flush(mockAllShopList);
  });

  it('should add Habit Custom Shop List', () => {
    service.addHabitCustomShopList(1, 2, [mockCustomItem]).subscribe((data) => {
      expect(data).toEqual(mockList);
    });
    const req = httpMock.expectOne(`${mainLink}custom/shopping-list-items/1/2/custom-shopping-list-items`);
    expect(req.request.method).toBe('POST');
    req.flush(mockList);
  });

  it('should update Standard Shop Item Status', () => {
    service.updateStandardShopItemStatus(mockItem, 'ua').subscribe((data) => {
      expect(data).toEqual(mockList);
    });
    const req = httpMock.expectOne(`${mainLink}user/shopping-list-items/1/status/INPROGRESS?lang=ua`);
    expect(req.request.method).toBe('PATCH');
    req.flush(mockList);
  });

  it('should update Custom Shop Item Status', () => {
    service.updateCustomShopItemStatus(1, mockItem).subscribe((data) => {
      expect(data).toEqual(mockItem);
    });
    const req = httpMock.expectOne(`${mainLink}custom/shopping-list-items/1/custom-shopping-list-items?itemId=1&status=INPROGRESS`);
    expect(req.request.method).toBe('PATCH');
    req.flush(mockItem);
  });

  it('should update Habit Shop List', () => {
    service.updateHabitShopList(mockUpdateHabitList).subscribe((data) => {
      expect(data).toEqual(null);
    });
    const req = httpMock.expectOne(`${mainLink}habit/assign/2/allUserAndCustomList?lang=ua`);
    expect(req.request.method).toBe('PUT');
    req.flush(null);
  });
});
