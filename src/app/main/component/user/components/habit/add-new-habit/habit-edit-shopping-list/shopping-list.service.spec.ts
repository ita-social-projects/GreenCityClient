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

  it('placeItemInOrder() should place item in correct order', () => {
    service.fillList(mockList);
    console.log(service.list);
    service.list[1].selected = true;
    service.placeItemInOrder();
    expect(service.list[0].text).toEqual('Item 2');
  });

  it('placeItemInOrder() should place item in correct order', () => {
    service.fillList(mockList);
    service.list[1].selected = true;
    service.placeItemInOrder();
    expect(service.list[0].text).toEqual('Item 2');
  });

  it('select() should change item prooerty selected from true to false', () => {
    service.fillList(mockList);
    const item = mockList[1];
    item.selected = true;
    service.select(item);
    expect(service.list[1].selected).toBeFalsy();
  });
});
