import { TestBed } from '@angular/core/testing';

import { AdminService } from './admin.service';

describe('AdminService', () => {
  let service: AdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminService]
    });

    service = TestBed.inject(AdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getter SortColumn should return value of sortColumn', () => {
    spyOnProperty(service, 'SortColumn', 'get').and.returnValue('testEmail');
    expect(service.SortColumn).toBe('testEmail');
  });

  it('setter SortColumn should be called with value', () => {
    const spy = spyOnProperty(service, 'SortColumn', 'set').and.callThrough();
    service.SortColumn = 'testEmail';
    expect(spy).toHaveBeenCalledWith('testEmail');
  });

  it('getter SortDirection should return value of sortDirection', () => {
    spyOnProperty(service, 'SortDirection', 'get').and.returnValue('testAsc');
    expect(service.SortDirection).toBe('testAsc');
  });

  it('setter SortDirection should be called with value', () => {
    const spy = spyOnProperty(service, 'SortDirection', 'set').and.callThrough();
    service.SortDirection = 'testAsc';
    expect(spy).toHaveBeenCalledWith('testAsc');
  });
});
