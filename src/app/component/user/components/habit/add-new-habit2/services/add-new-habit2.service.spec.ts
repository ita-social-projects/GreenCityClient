import { TestBed } from '@angular/core/testing';

import { AddNewHabit2Service } from './add-new-habit2.service';

describe('AddNewHabit2Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AddNewHabit2Service = TestBed.get(AddNewHabit2Service);
    expect(service).toBeTruthy();
  });
});
