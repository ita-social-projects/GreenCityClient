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

  it('getter staticSortColumn should return value of sortColumn', () => {
    spyOnProperty(service, 'staticSortColumn', 'get').and.returnValue('testEmail');
    expect(service.staticSortColumn).toBe('testEmail');
  });

  it('setter staticSortColumn should be called with value', () => {
    const spy = spyOnProperty(service, 'staticSortColumn', 'set').and.callThrough();
    service.staticSortColumn = 'testEmail';
    expect(spy).toHaveBeenCalledWith('testEmail');
  });

  it('getter staticSortDirection should return value of sortDirection', () => {
    spyOnProperty(service, 'staticSortDirection', 'get').and.returnValue('testAsc');
    expect(service.staticSortDirection).toBe('testAsc');
  });

  it('setter staticSortDirection should be called with value', () => {
    const spy = spyOnProperty(service, 'staticSortDirection', 'set').and.callThrough();
    service.staticSortDirection = 'testAsc';
    expect(spy).toHaveBeenCalledWith('testAsc');
  });
});
