import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatTableModule } from '@angular/material/table';
import { UbsAdminCustomersComponent } from './ubs-admin-customers.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommentPopUpComponent } from '../shared/components/comment-pop-up/comment-pop-up.component';
import { AdminCustomersService } from '@ubs/ubs-admin/services/admin-customers.service';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { ColumnParam } from './columnsParams';
import { ICustomerViolationTable } from '@ubs/ubs-admin/models/customer-violations-table.model';
import { ICustomerOrdersTable } from '@ubs/ubs-admin/models/customer-orders-table.model';
import { ICustomersTable } from '@ubs/ubs-admin/models/customers-table.model';
import { provideMockStore } from '@ngrx/store/testing';
import { MatSnackBarService } from '@global-service/mat-snack-bar/mat-snack-bar.service';

describe('UbsAdminCustomersComponent', () => {
  let component: UbsAdminCustomersComponent;
  let fixture: ComponentFixture<UbsAdminCustomersComponent>;
  let adminCustomersServiceMock: AdminCustomersService;
  let matDialogMock: jasmine.SpyObj<MatDialog>;
  let dialogRefMock: jasmine.SpyObj<any>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBarService>;

  const column: ColumnParam = { title: { ua: 'Заголовок', en: 'Title', key: 'titleKey' }, width: 60 };
  const chatLink = 'https://example.com';
  const userId = 'userId';
  const updatedData = 'newChatLink';

  const localStorageServiceMock: LocalStorageService = jasmine.createSpyObj('LocalStorageService', [
    'getCustomer',
    'removeCurrentCustomer',
    'setCustomer',
    'getCurrentLanguage'
  ]);

  beforeEach(waitForAsync(() => {
    adminCustomersServiceMock = jasmine.createSpyObj('AdminCustomersService', [
      'getCustomers',
      'getCustomerOrders',
      'getCustomerViolations',
      'addChatLink',
      'openChat'
    ]);
    adminCustomersServiceMock.getCustomers = () => of({} as ICustomersTable);
    adminCustomersServiceMock.getCustomerOrders = () => of({} as ICustomerOrdersTable);
    adminCustomersServiceMock.getCustomerViolations = () => of({} as ICustomerViolationTable);
    adminCustomersServiceMock.addChatLink = () => of(void 0);
    adminCustomersServiceMock.openChat = (chatUrl: string) => {
      chatUrl && window.open(chatUrl, '_blank');
    };

    matDialogMock = jasmine.createSpyObj('MatDialog', ['open']);
    dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);

    snackBarSpy = jasmine.createSpyObj('MatSnackBarService', ['openSnackBar']);

    dialogRefMock.componentInstance = {
      comment: null,
      isLink: false,
      header: null
    };

    matDialogMock.open.and.returnValue(dialogRefMock);
    dialogRefMock.afterClosed.and.returnValue(of(null));

    (localStorageServiceMock.getCustomer as jasmine.Spy).and.returnValue({
      userId: '123',
      chatLink: 'https://example.com'
    });

    (localStorageServiceMock.getCurrentLanguage as jasmine.Spy).and.returnValue('en');

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatTableModule,
        SharedModule,
        TranslateModule.forRoot(),
        InfiniteScrollModule,
        MatDatepickerModule,
        MatNativeDateModule,
        ReactiveFormsModule
      ],
      declarations: [UbsAdminCustomersComponent, CommentPopUpComponent],
      providers: [
        { provide: MatSnackBarService, useValue: snackBarSpy },
        { provide: MatDialog, useValue: matDialogMock },
        { provide: AdminCustomersService, useValue: adminCustomersServiceMock },
        provideMockStore({ initialState: {} })
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.tableData = [{ userId: 'userId', titleKey: 'oldChatLink' }];

    (component as any).AdminCustomersService = adminCustomersServiceMock;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('detects changes', () => {
    const changeDetectorRef = fixture.debugElement.injector.get(ChangeDetectorRef);
    const detectChangesSpy = spyOn(changeDetectorRef.constructor.prototype, 'detectChanges');

    component.ngAfterViewChecked();

    expect(detectChangesSpy).toHaveBeenCalled();
  });

  it('method togglePopUp should toggle display', () => {
    component.display = 'block';
    component.togglePopUp();
    expect(component.display).toBe('none');
  });

  it('method onDeleteFilter should reset data in filterForm', () => {
    component.onDeleteFilter('bonusesFrom', 'bonusesTo');
    expect(component.filterForm.value.bonusesFrom).toBe('');
    expect(component.filterForm.value.bonusesTo).toBe('');
  });
});
