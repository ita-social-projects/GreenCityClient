import { of } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { JwtService } from '@global-service/jwt/jwt.service';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { UbsConfirmPageComponent } from './ubs-confirm-page.component';
import { UBSOrderFormService } from '../../services/ubs-order-form.service';

describe('UbsConfirmPageComponent', () => {
  let component: UbsConfirmPageComponent;
  let fixture: ComponentFixture<UbsConfirmPageComponent>;
  const fakeSnackBar = jasmine.createSpyObj('fakeSnakBar', ['openSnackBar']);
  const fakeUBSOrderFormService = jasmine.createSpyObj('fakeUBSService', [
    'getOrderResponseErrorStatus',
    'getOrderStatus',
    'saveDataOnLocalStorage'
  ]);
  const fakeJwtService = jasmine.createSpyObj('fakeJwtService', ['']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsConfirmPageComponent],
      imports: [TranslateModule.forRoot(), RouterModule.forRoot([]), HttpClientTestingModule],
      providers: [
        { provide: MatSnackBarComponent, useValue: fakeSnackBar },
        { provide: UBSOrderFormService, useValue: fakeUBSOrderFormService },
        { provide: JwtService, useValue: fakeJwtService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsConfirmPageComponent);
    component = fixture.componentInstance;
    fakeUBSOrderFormService.orderId = of('123');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should call renderView with oderID', () => {
    fakeUBSOrderFormService.getOrderResponseErrorStatus.and.returnValue(false);
    fakeUBSOrderFormService.getOrderStatus.and.returnValue(true);
    const renderViewMock = spyOn(component, 'renderView');
    component.ngOnInit();
    expect(renderViewMock).toHaveBeenCalled();
  });

  it('ngOnInit should call renderView without oderID', () => {
    // @ts-ignore
    spyOn(component.orderService, 'getUbsOrderStatus').and.returnValue(of({ result: 'success', order_id: '123_456' }));
    const renderViewMock = spyOn(component, 'renderView');
    component.ngOnInit();
    expect(renderViewMock).toHaveBeenCalled();
  });

  it('in renderView should saveDataOnLocalStorage and openSnackBar be called', () => {
    component.orderStatusDone = false;
    component.orderResponseError = false;
    const saveDataOnLocalStorageMock = spyOn(component, 'saveDataOnLocalStorage');
    // @ts-ignore
    spyOn(component.activatedRoute.queryParams, 'subscribe').and.returnValue(of({ order_id: '132', response_status: true }));
    component.renderView();
    expect(saveDataOnLocalStorageMock).toHaveBeenCalled();
    expect(fakeSnackBar.openSnackBar).toHaveBeenCalled();
  });

  it('in renderView should saveDataOnLocalStorage when no error occurred', () => {
    component.orderStatusDone = true;
    component.orderResponseError = false;
    const saveDataOnLocalStorageMock = spyOn(component, 'saveDataOnLocalStorage');
    component.renderView();
    expect(saveDataOnLocalStorageMock).toHaveBeenCalled();
  });
});
