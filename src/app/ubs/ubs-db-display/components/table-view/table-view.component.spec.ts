import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableViewComponent } from './table-view.component';
import { TableService } from '@ubs/ubs-db-display/services/table.service';
import { of } from 'rxjs';
import { TableDataResponse } from '@ubs/ubs-db-display/models/table.model';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatSnackBarService } from '@global-service/mat-snack-bar/mat-snack-bar.service';

describe('TableViewComponent', () => {
  let component: TableViewComponent;
  let fixture: ComponentFixture<TableViewComponent>;
  let mockTableService: jasmine.SpyObj<TableService>;
  const MatSnackBarMock = jasmine.createSpyObj('MatSnackBarService', ['openSnackBar']);

  const mockResponsePage1: TableDataResponse = {
    tableName: 'test-table',
    currentPage: 0,
    first: true,
    hasNext: true,
    hasPrevious: false,
    last: false,
    number: 0,
    totalElements: 100,
    totalPages: 2,
    page: [{ id: '1', name: 'row1' }]
  };

  const mockResponsePage2: TableDataResponse = {
    ...mockResponsePage1,
    currentPage: 1,
    page: [{ id: '2', name: 'row2' }],
    hasNext: false
  };

  beforeEach(() => {
    mockTableService = jasmine.createSpyObj('TableService', ['getTableData']);
    TestBed.configureTestingModule({
      declarations: [TableViewComponent],
      imports: [InfiniteScrollModule],
      providers: [
        { provide: TableService, useValue: mockTableService },
        { provide: MatSnackBarService, useValue: MatSnackBarMock }
      ]
    });
    fixture = TestBed.createComponent(TableViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load next page on scroll if hasNext is true and not loading', () => {
    component.tableName = 'test-table';
    component.tableDataResponse = {
      ...mockResponsePage1,
      currentPage: 0
    };
    component.isLoading = false;
    mockTableService.getTableData.and.returnValue(of(mockResponsePage2));
    component.onScroll();

    expect(mockTableService.getTableData).toHaveBeenCalledWith('test-table', 1, 50);
  });

  it('should not call loadPage on scroll if already loading more', () => {
    component.isLoading = true;
    component.tableDataResponse = mockResponsePage1;

    component.onScroll();

    expect(mockTableService.getTableData).not.toHaveBeenCalled();
  });

  it('should not call loadPage if hasNext is false', () => {
    component.isLoading = false;
    component.tableDataResponse = {
      ...mockResponsePage1,
      hasNext: false
    };

    component.onScroll();

    expect(mockTableService.getTableData).not.toHaveBeenCalled();
  });

  it('should set isLoadingMore properly when loading a non-initial page', () => {
    component.tableName = 'test-table';
    component.tableDataResponse = {
      ...mockResponsePage1,
      currentPage: 0,
      hasNext: true
    };

    mockTableService.getTableData.and.returnValue(of(mockResponsePage2));
    component.onScroll();

    expect(component.isLoading).toBeFalse();
    expect(component.tableDataResponse?.page.length).toBe(2);
  });
});
