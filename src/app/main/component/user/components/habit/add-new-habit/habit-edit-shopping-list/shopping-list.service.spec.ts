import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { ShoppingListService } from './shopping-list.service';
import { ShoppingList } from '@global-user/models/shoppinglist.model';

describe('ShoppingListService', () => {
  let service: ShoppingListService;

  const mockItem: ShoppingList = {
    id: 1,
    status: 'string',
    text: 'string',
    selected: false
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShoppingListService],
      imports: [HttpClientModule]
    });

    service = TestBed.inject(ShoppingListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('shopping-list.service should create', () => {
    expect(service).toBeDefined();
  });

  it('select() should invoke placeItemInOrder() method', () => {
    spyOn(service, 'placeItemInOrder');
    service.select(mockItem);
    expect(service.placeItemInOrder).toHaveBeenCalled();
  });

  it('addItem() should invoke placeItemInOrder() method', () => {
    spyOn(service, 'placeItemInOrder');
    service.addItem('New item');
    expect(service.placeItemInOrder).toHaveBeenCalled();
  });
});
