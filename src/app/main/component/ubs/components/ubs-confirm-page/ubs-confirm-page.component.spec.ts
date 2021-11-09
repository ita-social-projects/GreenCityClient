import { of, Subscription } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { JwtService } from '@global-service/jwt/jwt.service';

import { UbsConfirmPageComponent } from './ubs-confirm-page.component';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
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
      imports: [TranslateModule.forRoot(), RouterModule.forRoot([])],
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

  it('ngOnInit should subscribe on activatedRoute.queryParams', () => {
    fakeUBSOrderFormService.getOrderResponseErrorStatus.and.returnValue(false);
    fakeUBSOrderFormService.getOrderStatus.and.returnValue(false);
    spyOn(component, 'saveDataOnLocalStorage');
    // @ts-ignore
    spyOn(component.activatedRoute.queryParams, 'subscribe').and.callFake(() => new Subscription());
    component.ngOnInit();
    // @ts-ignore
    expect(component.activatedRoute.queryParams.subscribe).toHaveBeenCalled();
  });

  it('in ngOnInit should saveDataOnLocalStorage be called', () => {
    fakeUBSOrderFormService.getOrderResponseErrorStatus.and.returnValue(false);
    fakeUBSOrderFormService.getOrderStatus.and.returnValue(true);
    spyOn(component, 'saveDataOnLocalStorage').and.returnValue(null);
    component.ngOnInit();
    expect(component.saveDataOnLocalStorage).toHaveBeenCalled();
  });
});
