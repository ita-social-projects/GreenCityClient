import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ShoppingListService } from './shopping-list.service';
import { AllShoppingLists, ShoppingList } from '@global-user/models/shoppinglist.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from '@environment/environment.js';

fdescribe('ShoppingListService', () => {
  let service: ShoppingListService;
  let httpMock: HttpTestingController;

  const mainLink = environment.backendLink;

  const mockItem: ShoppingList = {
    id: 1,
    status: 'INPROGRESS',
    text: 'string',
    selected: false
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
});
