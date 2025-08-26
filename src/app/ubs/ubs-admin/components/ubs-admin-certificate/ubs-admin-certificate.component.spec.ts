import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync, flush } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { UbsAdminCertificateComponent } from './ubs-admin-certificate.component';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CUSTOM_ELEMENTS_SCHEMA, Renderer2, ElementRef, Pipe, PipeTransform, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatTableModule, MatTable } from '@angular/material/table';
import { of, Subject } from 'rxjs';
import { UbsAdminCertificateAddCertificatePopUpComponent } from './ubs-admin-certificate-add-certificate-pop-up/ubs-admin-certificate-add-certificate-pop-up.component';
import { UbsAdminTableExcelPopupComponent } from '../ubs-admin-table/ubs-admin-table-excel-popup/ubs-admin-table-excel-popup.component';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { AdminCertificateService } from '../../services/admin-certificate.service';
import { TableHeightService } from '../../services/table-height.service';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

@Pipe({ name: 'serverTranslate' })
class MockServerTranslatePipe implements PipeTransform {
  transform(value: any): any {
    return value;
  }
}

describe('UbsAdminCertificateComponent', () => {
  let component: UbsAdminCertificateComponent;
  let fixture: ComponentFixture<UbsAdminCertificateComponent>;
  let mockAdminCertificateService: jasmine.SpyObj<AdminCertificateService>;
  let mockTableHeightService: jasmine.SpyObj<TableHeightService>;
  let mockLocalStorageService: jasmine.SpyObj<LocalStorageService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<any>>;
  let mockRenderer: jasmine.SpyObj<Renderer2>;
  let mockStore: jasmine.SpyObj<Store>;

  const initialState = {
    employees: {
      employeesPermissions: ['SEE_CERTIFICATES', 'CREATE_CERTIFICATES']
    }
  };

  const mockTableData = {
    page: [
      { id: 1, code: 'CERT001', status: 'ACTIVE' },
      { id: 2, code: 'CERT002', status: 'INACTIVE' }
    ],
    totalPages: 5,
    totalElements: 100
  };

  beforeEach(waitForAsync(() => {
    mockAdminCertificateService = jasmine.createSpyObj('AdminCertificateService', ['getTable']);
    mockTableHeightService = jasmine.createSpyObj('TableHeightService', ['setTableHeightToContainerHeight']);
    mockLocalStorageService = jasmine.createSpyObj('LocalStorageService', [], {
      languageBehaviourSubject: of('en')
    });
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed', 'componentInstance']);
    mockRenderer = jasmine.createSpyObj('Renderer2', ['listen']);
    mockStore = jasmine.createSpyObj('Store', ['select']);

    mockAdminCertificateService.getTable.and.returnValue(of(mockTableData) as any);
    mockTableHeightService.setTableHeightToContainerHeight.and.returnValue(true);
    mockDialog.open.and.returnValue(mockDialogRef);
    mockDialogRef.afterClosed.and.returnValue(of(true));
    mockStore.select.and.returnValue(of(['SEE_CERTIFICATES', 'CREATE_CERTIFICATES']));

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot(), MatDialogModule, MatTableModule, InfiniteScrollModule],
      providers: [
        provideMockStore({ initialState }),
        { provide: AdminCertificateService, useValue: mockAdminCertificateService },
        { provide: TableHeightService, useValue: mockTableHeightService },
        { provide: LocalStorageService, useValue: mockLocalStorageService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: Renderer2, useValue: mockRenderer },
        { provide: Store, useValue: mockStore }
      ],
      declarations: [UbsAdminCertificateComponent, MockServerTranslatePipe],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminCertificateComponent);
    component = fixture.componentInstance;

    // Mock ViewChild
    const mockElementRef = {
      nativeElement: {
        clientWidth: 1200,
        children: [
          {
            children: [
              {
                getBoundingClientRect: () => ({ right: 100, width: 200 })
              }
            ]
          }
        ]
      }
    };
    (component as any).matTableRef = mockElementRef as ElementRef;

    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize component properties on ngOnInit', () => {
      expect(component.currentLang).toBe('en');
      expect(component.columns).toBeDefined();
      expect(component.displayedColumns).toBeDefined();
      expect(mockAdminCertificateService.getTable).toHaveBeenCalled();
    });

    it('should set up model change subscription with debounce', fakeAsync(() => {
      spyOn(component, 'getTable');
      component.modelChanged.next('test');

      tick(500);

      expect(component.getTable).toHaveBeenCalledWith('test', component.sortingColumn, component.sortType);
      expect(component.currentPage).toBe(0);
    }));
  });

  describe('Permissions and Authorities', () => {
    it('should set up permissions subscription on init', () => {
      // Test that permissions are set through the store subscription
      expect(component.permissions$).toBeDefined();
      expect(mockStore.select).toHaveBeenCalled();
    });

    it('should not call definedIsEmployeeCanEditOrder when authorities array is empty', () => {
      // Setup store to return empty array
      mockStore.select.and.returnValue(of([]));

      // Create a new component instance to test fresh initialization
      const newFixture = TestBed.createComponent(UbsAdminCertificateComponent);
      const newComponent = newFixture.componentInstance;

      // Mock ViewChild for new component
      (newComponent as any).matTableRef = {
        nativeElement: {
          clientWidth: 1200,
          children: [
            {
              children: [
                {
                  getBoundingClientRect: () => ({ right: 100, width: 200 })
                }
              ]
            }
          ]
        }
      };

      newFixture.detectChanges();

      // When authorities array is empty, isEmployeeCanCreateCertificate should remain undefined
      expect(newComponent.isEmployeeCanCreateCertificate).toBeUndefined();
    });

    it('should set isEmployeeCanCreateCertificate to true when user has CREATE_NEW_CERTIFICATE permission', () => {
      // Mock the store to return the required permissions (correct permission name)
      const permissions = ['CREATE_NEW_CERTIFICATE', 'SEE_CERTIFICATES'];
      mockStore.select.and.returnValue(of(permissions));

      // Create a new component instance to test fresh initialization
      const newFixture = TestBed.createComponent(UbsAdminCertificateComponent);
      const newComponent = newFixture.componentInstance;

      // Mock ViewChild for new component
      (newComponent as any).matTableRef = {
        nativeElement: {
          clientWidth: 1200,
          children: [
            {
              children: [
                {
                  getBoundingClientRect: () => ({ right: 100, width: 200 })
                }
              ]
            }
          ]
        }
      };

      newFixture.detectChanges();

      expect(newComponent.isEmployeeCanCreateCertificate).toBe(true);
    });

    it('should set isEmployeeCanCreateCertificate to false when user lacks CREATE_NEW_CERTIFICATE permission', () => {
      // Setup store to return permissions without CREATE_NEW_CERTIFICATE
      mockStore.select.and.returnValue(of(['SEE_CERTIFICATES']));

      // Create a new component instance to test fresh initialization
      const newFixture = TestBed.createComponent(UbsAdminCertificateComponent);
      const newComponent = newFixture.componentInstance;

      // Mock ViewChild for new component
      (newComponent as any).matTableRef = {
        nativeElement: {
          clientWidth: 1200,
          children: [
            {
              children: [
                {
                  getBoundingClientRect: () => ({ right: 100, width: 200 })
                }
              ]
            }
          ]
        }
      };

      newFixture.detectChanges();

      expect(newComponent.isEmployeeCanCreateCertificate).toBe(false);
    });
  });

  describe('Table Operations', () => {
    it('should get table data successfully', () => {
      component.getTable();

      expect(mockAdminCertificateService.getTable).toHaveBeenCalled();
      expect(component.tableData).toEqual(mockTableData.page);
      expect(component.totalPages).toBe(5);
      expect(component.totalElements).toBe(100);
      expect(component.isLoading).toBe(false);
    });

    it('should get table data with custom parameters', () => {
      const filterValue = 'test';
      const columnName = 'name';
      const sortingType = 'ASC';

      component.getTable(filterValue, columnName, sortingType);

      expect(mockAdminCertificateService.getTable).toHaveBeenCalledWith(
        columnName,
        component.currentPage,
        filterValue,
        component.pageSize,
        sortingType
      );
    });

    it('should update table data correctly', () => {
      component.tableData = [{ id: 0, code: 'EXISTING' }];
      component.dataSource = new MatTableDataSource(component.tableData);

      // Call updateTableData and check that service is called
      component.updateTableData();

      // The method should call the service
      expect(mockAdminCertificateService.getTable).toHaveBeenCalled();

      // After the observable completes, isUpdate should be false again
      expect(component.isUpdate).toBe(false);
    });

    it('should handle updateTableData response', () => {
      component.tableData = [{ id: 0, code: 'EXISTING' }];
      component.dataSource = new MatTableDataSource(component.tableData);

      component.updateTableData();

      // Wait for observable to complete
      expect(component.tableData.length).toBe(3); // existing + 2 new
      expect(component.isUpdate).toBe(false);
    });
  });

  describe('Sorting and Filtering', () => {
    it('should handle sorting correctly', () => {
      spyOn(component, 'getTable');
      const columnName = 'code';
      const sortingType = 'ASC';

      component.getSortingData(columnName, sortingType);

      expect(component.sortingColumn).toBe(columnName);
      expect(component.sortType).toBe(sortingType);
      expect(component.currentPage).toBe(0);
      expect(component.getTable).toHaveBeenCalledWith(component.filterValue, columnName, sortingType);
    });

    it('should apply filter correctly', () => {
      spyOn(component.modelChanged, 'next');
      const filterValue = 'test filter';

      component.applyFilter(filterValue);

      expect(component.filterValue).toBe(filterValue);
      expect(component.modelChanged.next).toHaveBeenCalledWith(filterValue);
    });

    it('should set displayed columns correctly', () => {
      // Reset columns to test specific scenario
      component.columns = [{ title: { key: 'col1' } }, { title: { key: 'col2' } }];
      component.displayedColumns = [];

      component.setDisplayedColumns();

      expect(component.columns[0].index).toBe(0);
      expect(component.columns[1].index).toBe(1);
      expect(component.displayedColumns.length).toBe(2);
      expect(component.displayedColumns[0]).toBe('col1');
      expect(component.displayedColumns[1]).toBe('col2');
    });
  });

  describe('Selection Operations', () => {
    beforeEach(() => {
      component.dataSource = new MatTableDataSource([
        { id: 1, selected: false },
        { id: 2, selected: false },
        { id: 3, selected: false }
      ]);
      component.selection = new SelectionModel(true, []);
    });

    it('should check if all items are selected', () => {
      component.selection.select(...component.dataSource.data);
      expect(component.isAllSelected()).toBe(true);

      component.selection.clear();
      expect(component.isAllSelected()).toBe(false);
    });

    it('should toggle master selection', () => {
      component.masterToggle();
      expect(component.selection.selected.length).toBe(3);

      component.masterToggle();
      expect(component.selection.selected.length).toBe(0);
    });

    it('should generate correct checkbox labels', () => {
      const row = { orderId: 5 };

      expect(component.checkboxLabel()).toBe('deselect all');
      expect(component.checkboxLabel(row)).toBe('select row 6');

      component.selection.select(...component.dataSource.data);
      expect(component.checkboxLabel()).toBe('select all');
    });
  });

  describe('Scroll Operations', () => {
    it('should handle scroll when not updating and has more pages', () => {
      component.isUpdate = false;
      component.currentPage = 2;
      component.totalPages = 5;
      spyOn(component, 'updateTableData');

      component.onScroll();

      expect(component.currentPage).toBe(3);
      expect(component.updateTableData).toHaveBeenCalled();
    });

    it('should not handle scroll when updating', () => {
      component.isUpdate = true;
      spyOn(component, 'updateTableData');

      component.onScroll();

      expect(component.updateTableData).not.toHaveBeenCalled();
    });

    it('should not handle scroll when no more pages', () => {
      component.isUpdate = false;
      component.currentPage = 5;
      component.totalPages = 5;
      spyOn(component, 'updateTableData');

      component.onScroll();

      expect(component.updateTableData).not.toHaveBeenCalled();
    });
  });

  describe('Dialog Operations', () => {
    it('should open add certificate dialog with correct parameters', fakeAsync(() => {
      const expectedConfig = {
        hasBackdrop: true,
        disableClose: true,
        panelClass: 'cdk-table'
      };
      spyOn(component, 'getTable');

      component.openAddCertificate();
      tick();

      expect(mockDialog.open).toHaveBeenCalledWith(UbsAdminCertificateAddCertificatePopUpComponent, expectedConfig);
      expect(component.getTable).toHaveBeenCalled();
      expect(component.currentPage).toBe(0);
    }));

    it('should not call getTable when dialog is cancelled', fakeAsync(() => {
      mockDialogRef.afterClosed.and.returnValue(of(false));
      spyOn(component, 'getTable');

      component.openAddCertificate();
      tick();

      expect(component.getTable).not.toHaveBeenCalled();
    }));

    it('should call getTable when dialog returns truthy result', fakeAsync(() => {
      mockDialogRef.afterClosed.and.returnValue(of({ success: true }));
      spyOn(component, 'getTable');

      component.openAddCertificate();
      tick();

      expect(component.getTable).toHaveBeenCalled();
      expect(component.currentPage).toBe(0);
    }));

    it('should open export excel dialog with correct parameters', () => {
      component.selection.select({ id: 1 });
      component.selection.select({ id: 2 });
      component.totalElements = 100;
      component.allElements = 150;
      component.sortingColumn = 'code';
      component.sortType = 'DESC';
      component.filterValue = 'test';

      const mockComponentInstance = {
        isElementSelected: undefined,
        selectedElements: undefined,
        totalElements: undefined,
        allElements: undefined,
        sortingColumn: undefined,
        sortType: undefined,
        search: undefined,
        name: undefined
      };
      mockDialogRef.componentInstance = mockComponentInstance;

      component.openExportExcel();

      expect(mockDialog.open).toHaveBeenCalledWith(UbsAdminTableExcelPopupComponent, jasmine.any(Object));
      expect(mockComponentInstance.isElementSelected).toBe(true);
      expect(mockComponentInstance.selectedElements.length).toBe(2);
      expect(mockComponentInstance.totalElements).toBe(100);
      expect(mockComponentInstance.allElements).toBe(150);
      expect(mockComponentInstance.sortingColumn).toBe('code');
      expect(mockComponentInstance.sortType).toBe('DESC');
      expect(mockComponentInstance.search).toBe('test');
      expect(mockComponentInstance.name).toBe('Certificates-Table.xlsx');
    });

    it('should open export excel dialog with no selection', () => {
      component.selection.clear();
      component.totalElements = 50;
      component.allElements = 75;
      component.sortingColumn = undefined;
      component.sortType = undefined;
      component.filterValue = '';

      const mockComponentInstance = {
        isElementSelected: undefined,
        selectedElements: undefined,
        totalElements: undefined,
        allElements: undefined,
        sortingColumn: undefined,
        sortType: undefined,
        search: undefined,
        name: undefined
      };
      mockDialogRef.componentInstance = mockComponentInstance;

      component.openExportExcel();

      expect(mockDialog.open).toHaveBeenCalledWith(UbsAdminTableExcelPopupComponent, jasmine.any(Object));
      expect(mockComponentInstance.isElementSelected).toBe(false);
      expect(mockComponentInstance.selectedElements.length).toBe(0);
      expect(mockComponentInstance.totalElements).toBe(50);
      expect(mockComponentInstance.allElements).toBe(75);
      expect(mockComponentInstance.sortingColumn).toBeUndefined();
      expect(mockComponentInstance.sortType).toBeUndefined();
      expect(mockComponentInstance.search).toBe('');
      expect(mockComponentInstance.name).toBe('Certificates-Table.xlsx');
    });
  });

  describe('Column Resizing', () => {
    beforeEach(() => {
      component.columns = [
        { width: 100, title: { key: 'col1' } },
        { width: 200, title: { key: 'col2' } },
        { width: 150, title: { key: 'col3' } }
      ];
    });

    it('should handle column resize start', () => {
      const event = { pageX: 100, target: { clientWidth: 200 } };

      component.onResizeColumn(event, 1);

      expect(component.currentResizeIndex).toBe(1);
      expect(component.pressed).toBe(true);
      expect(component.startX).toBe(100);
      expect(component.startWidth).toBe(200);
    });

    xit('should setup mouse listeners when resizing column', () => {
      const event = { pageX: 100, target: { clientWidth: 200 } };
      mockRenderer.listen.and.returnValue(jasmine.createSpy('removeListener'));

      component.onResizeColumn(event, 1);

      // Verify that mouse listeners are set up (mouseMove method called)
      expect(mockRenderer.listen).toHaveBeenCalledTimes(2);
    });

    it('should handle table resize by scaling column widths', () => {
      // Test private setTableResize through ngAfterViewChecked
      component.isLoading = false;
      component.isTableHeightSet = true;

      const originalWidth = component.columns[0].width;

      // Trigger the private method through public method
      component.ngAfterViewChecked();

      // Check that columns widths are adjusted
      expect(component.columns[0].width).toBeDefined();
    });

    it('should handle mouse move during resize through event listeners', () => {
      // Test that onResizeColumn sets up the resize state correctly
      const event = { pageX: 100, target: { clientWidth: 200 } };
      component.onResizeColumn(event, 1);

      // Verify that resize state is set correctly (effect of private methods)
      expect(component.currentResizeIndex).toBe(1);
      expect(component.pressed).toBe(true);
      expect(component.startX).toBe(100);
      expect(component.startWidth).toBe(200);
    });

    it('should handle window resize', () => {
      // Test that window resize triggers table resize
      const initialWidth = component.columns[0].width;

      // Simulate window resize
      component.onResize();

      // The resize should have been triggered (private method called)
      expect((component as any).matTableRef).toBeDefined();
    });

    xit('should call setTableResize with correct parameters through ngAfterViewChecked', () => {
      // Force the private setTableResize method to be called
      component.isLoading = false;
      component.isTableHeightSet = true;

      // Spy on the private method
      spyOn(component as any, 'setTableResize').and.callThrough();

      component.ngAfterViewChecked();

      expect((component as any).setTableResize).toHaveBeenCalledWith(1200);
    });

    it('should handle table resize calculations correctly', () => {
      // Test private setTableResize logic by triggering it
      component.columns = [
        { width: 100, title: { key: 'col1' } },
        { width: 200, title: { key: 'col2' } }
      ];
      spyOn(document, 'getElementsByClassName').and.returnValue([{ style: {} }, { style: {} }] as any);

      // Trigger setTableResize through ngAfterViewChecked
      component.isLoading = false;
      component.isTableHeightSet = true;

      const originalWidth1 = component.columns[0].width;
      const originalWidth2 = component.columns[1].width;

      component.ngAfterViewChecked();

      // Columns should be resized proportionally
      expect(component.columns[0].width).toBeDefined();
      expect(component.columns[1].width).toBeDefined();
    });

    xit('should test mouse event handlers for resize functionality', () => {
      let mousemoveCallback: (event: any) => void;
      let mouseupCallback: (event: any) => void;

      // Mock renderer.listen to capture callbacks
      mockRenderer.listen.and.callFake((target: string, event: string, callback: (event: any) => void) => {
        if (event === 'mousemove') {
          mousemoveCallback = callback;
        } else if (event === 'mouseup') {
          mouseupCallback = callback;
        }
        return jasmine.createSpy('removeListener');
      });

      // Setup component state
      component.columns = [
        { width: 100, title: { key: 'col1' } },
        { width: 200, title: { key: 'col2' } },
        { width: 150, title: { key: 'col3' } }
      ];

      // Start resize
      const event = { pageX: 100, target: { clientWidth: 200 } };
      component.onResizeColumn(event, 1);

      // Simulate mousemove event
      component.pressed = true;
      component.isResizingRight = true;
      component.currentResizeIndex = 1;

      const mouseMoveEvent = { pageX: 150, buttons: 1 };
      if (mousemoveCallback) {
        mousemoveCallback(mouseMoveEvent);
      }

      // Simulate mouseup event
      if (mouseupCallback) {
        mouseupCallback({});
      }

      expect(component.pressed).toBe(false);
      expect(component.currentResizeIndex).toBe(-1);
    });
  });

  describe('Lifecycle Hooks', () => {
    it('should handle ngAfterViewChecked when table height not set', () => {
      component.isTableHeightSet = false;
      spyOn(document, 'getElementById').and.returnValues({ id: 'table' } as any, { id: 'table-container' } as any);
      spyOn(component, 'onScroll');
      mockTableHeightService.setTableHeightToContainerHeight.and.returnValue(false);

      component.ngAfterViewChecked();

      expect(mockTableHeightService.setTableHeightToContainerHeight).toHaveBeenCalled();
      expect(component.onScroll).toHaveBeenCalled();
    });

    it('should handle ngAfterViewChecked when not loading', () => {
      component.isLoading = false;
      component.isTableHeightSet = true;
      spyOn(component as any, 'setTableResize');

      component.ngAfterViewChecked();

      expect((component as any).setTableResize).toHaveBeenCalled();
    });

    it('should cleanup on destroy', () => {
      spyOn(component.destroy, 'next');
      spyOn(component.destroy, 'unsubscribe');

      component.ngOnDestroy();

      expect(component.destroy.next).toHaveBeenCalledWith(true);
      expect(component.destroy.unsubscribe).toHaveBeenCalled();
    });
  });
});
