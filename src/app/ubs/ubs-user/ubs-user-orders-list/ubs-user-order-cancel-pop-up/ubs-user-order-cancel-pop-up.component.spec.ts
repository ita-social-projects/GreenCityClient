import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatLegacyDialogModule as MatDialogModule, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { UserOrdersService } from '../../services/user-orders.service';

import { UbsUserOrderCancelPopUpComponent } from './ubs-user-order-cancel-pop-up.component';

describe('UbsUserOrderCancelPopUpComponent', () => {
  let component: UbsUserOrderCancelPopUpComponent;
  let fixture: ComponentFixture<UbsUserOrderCancelPopUpComponent>;

  const mockedData = {
    orderId: 2,
    price: 555,
    orders: [
      {
        id: 1
      },
      {
        id: 2
      },
      {
        id: 3
      }
    ],
    bonuses: 222
  };
  const userOrdersServiceMock = jasmine.createSpyObj('userOrdersService', ['deleteOrder']);
  userOrdersServiceMock.deleteOrder.and.returnValue(of());

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UbsUserOrderCancelPopUpComponent],
      imports: [MatDialogModule, TranslateModule.forRoot()],
      providers: [
        { provide: UserOrdersService, useValue: userOrdersServiceMock },
        { provide: MAT_DIALOG_DATA, useValue: mockedData }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsUserOrderCancelPopUpComponent);
    component = fixture.componentInstance;
    component.data = JSON.parse(JSON.stringify(mockedData));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('makes expected calls for deleteCard', () => {
    component.deleteCard();
    expect(userOrdersServiceMock.deleteOrder).toHaveBeenCalledWith(2);
    expect(component.data.orders.length).toBe(2);
  });
});
