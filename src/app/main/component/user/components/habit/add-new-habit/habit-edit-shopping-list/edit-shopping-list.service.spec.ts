import { TestBed } from '@angular/core/testing';

import { EditShoppingListService } from './edit-shopping-list.service';

describe('EditShoppingListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EditShoppingListService = TestBed.inject(EditShoppingListService);
    expect(service).toBeTruthy();
  });
});
