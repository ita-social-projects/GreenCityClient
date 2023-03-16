import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { ShoppingListService } from './shopping-list.service';
import { ShoppingList } from '@global-user/models/shoppinglist.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('ShoppingListService', () => {
  let service: ShoppingListService;

  const mockItem: ShoppingList = {
    id: 1,
    status: 'string',
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShoppingListService, TranslateService],
      imports: [HttpClientModule, TranslateModule.forRoot()]
    });

    service = TestBed.inject(ShoppingListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('shopping-list.service should create', () => {
    expect(service).toBeDefined();
  });
});
