import { Location } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { UbsAdminCustomerDetailsComponent } from './ubs-admin-customer-details.component';
import { AdminCustomersService } from '@ubs/ubs-admin/services/admin-customers.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { MatSnackBarService } from '@global-service/mat-snack-bar/mat-snack-bar.service';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('UbsAdminCustomerDetailsComponent', () => {
  let component: UbsAdminCustomerDetailsComponent;
  let fixture: ComponentFixture<UbsAdminCustomerDetailsComponent>;
  let adminCustomerServiceMock: jasmine.SpyObj<AdminCustomersService>;
  let httpClientMock: jasmine.SpyObj<HttpClient>;
  let matDialogMock: jasmine.SpyObj<MatDialog>;
  let dialogRefMock: jasmine.SpyObj<any>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBarService>;
  let router: Router;

  const localStorageServiceMock: LocalStorageService = jasmine.createSpyObj('LocalStorageService', [
    'getCustomer',
    'removeCurrentCustomer',
    'setCustomer'
  ]);
  let locationMock: Location;

  beforeEach(waitForAsync(() => {
    adminCustomerServiceMock = jasmine.createSpyObj('AdminCustomerService', ['openChat', 'addChatLink']);
    matDialogMock = jasmine.createSpyObj('MatDialog', ['open']);
    dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBarService', ['openSnackBar']);

    dialogRefMock.componentInstance = {
      comment: '',
      isLink: true
    };

    matDialogMock.open.and.returnValue(dialogRefMock);
    dialogRefMock.afterClosed.and.returnValue(of(null));

    (localStorageServiceMock.getCustomer as jasmine.Spy).and.returnValue({
      userId: '123',
      chatLink: 'https://example.com'
    });

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([])],
      declarations: [UbsAdminCustomerDetailsComponent],
      providers: [
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: AdminCustomersService, useValue: adminCustomerServiceMock },
        { provide: HttpClient, useValue: httpClientMock },
        { provide: MatDialog, useValue: matDialogMock },
        { provide: MatSnackBarService, useValue: snackBarSpy },
        Location
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminCustomerDetailsComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.stub();
    locationMock = TestBed.inject(Location);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('goBack() should be called', () => {
    const spyLock = spyOn(locationMock, 'back');
    component.goBack();
    expect(spyLock).toHaveBeenCalled();
  });

  it('on onOpenChat should redirect to chat with a client', () => {
    const chatIdMock = 12;

    component.onOpenChat(chatIdMock);

    expect(router.navigate).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['ubs/admin', 'chat-page'], { state: { selectedChatId: chatIdMock } });
  });
  it('should call onOpenChat when button is clicked', () => {
    const onOpenChatSpy = spyOn(component, 'onOpenChat');

    component.customer = { chatId: 123 };
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('.button-wrapper button'));
    button.triggerEventHandler('click', null);

    expect(onOpenChatSpy).toHaveBeenCalledWith(123);
  });
});
