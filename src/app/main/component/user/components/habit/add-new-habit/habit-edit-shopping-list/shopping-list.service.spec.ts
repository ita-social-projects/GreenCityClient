import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ShoppingListService } from './shopping-list.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from '@environment/environment.js';
import { ALLUSERSHOPLISTS, CUSTOMSHOPITEM, SHOPLIST, SHOPLISTITEMONE, UPDATEHABITSHOPLIST } from '../../mocks/shopping-list-mock';

describe('ShoppingListService', () => {
  let service: ShoppingListService;
  let httpMock: HttpTestingController;

  const mainLink = environment.backendLink;

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

  it('should return allShopList by habitId on getHabitAllShopLists', () => {
    service.getHabitAllShopLists(2, 'en').subscribe((data) => {
      expect(data).toEqual(ALLUSERSHOPLISTS);
    });

    const req = httpMock.expectOne(`${mainLink}habit/assign/2/allUserAndCustomList?lang=en`);
    expect(req.request.responseType).toEqual('json');
    expect(req.request.method).toBe('GET');
    req.flush(ALLUSERSHOPLISTS);
  });

  it('should return all user shopList by lang on getUserShoppingLists', () => {
    service.getUserShoppingLists('ua').subscribe((data) => {
      expect(data).toEqual([ALLUSERSHOPLISTS]);
    });

    const req = httpMock.expectOne(`${mainLink}habit/assign/allUserAndCustomShoppingListsInprogress?lang=ua`);
    expect(req.request.responseType).toEqual('json');
    expect(req.request.method).toBe('GET');
    req.flush([ALLUSERSHOPLISTS]);
  });

  it('should add Habit Custom Shop List', () => {
    service.addHabitCustomShopList(1, 2, [CUSTOMSHOPITEM]).subscribe((data) => {
      expect(data).toEqual(SHOPLIST);
    });
    const req = httpMock.expectOne(`${mainLink}custom/shopping-list-items/1/2/custom-shopping-list-items`);
    expect(req.request.method).toBe('POST');
    req.flush(SHOPLIST);
  });

  it('should update Standard Shop Item Status', () => {
    service.updateStandardShopItemStatus(SHOPLISTITEMONE, 'ua').subscribe((data) => {
      expect(data).toEqual(SHOPLIST);
    });
    const req = httpMock.expectOne(`${mainLink}user/shopping-list-items/1/status/INPROGRESS?lang=ua`);
    expect(req.request.method).toBe('PATCH');
    req.flush(SHOPLIST);
  });

  it('should update Custom Shop Item Status', () => {
    service.updateCustomShopItemStatus(1, SHOPLISTITEMONE).subscribe((data) => {
      expect(data).toEqual(SHOPLISTITEMONE);
    });
    const req = httpMock.expectOne(`${mainLink}custom/shopping-list-items/1/custom-shopping-list-items?itemId=1&status=INPROGRESS`);
    expect(req.request.method).toBe('PATCH');
    req.flush(SHOPLISTITEMONE);
  });

  it('should update Habit Shop List', () => {
    service.updateHabitShopList(UPDATEHABITSHOPLIST).subscribe((data) => {
      expect(data).toEqual(null);
    });
    const req = httpMock.expectOne(`${mainLink}habit/assign/2/allUserAndCustomList?lang=ua`);
    expect(req.request.method).toBe('PUT');
    req.flush(null);
  });
});
