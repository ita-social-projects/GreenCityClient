import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ViewViolationModalComponent } from './view-violation-modal.component';
import { OrderService } from '@ubs/ubs-admin/services/order.service';
import { IViolation } from '@ubs/ubs-admin/models/violation.model';
import { ViolationLevel } from '@ubs/ubs/enums/violation-level.enum';
import { ShowImgsPopUpComponent } from '@ubs/shared/components/show-imgs-pop-up/show-imgs-pop-up.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';

describe('ViewViolationModalComponent', () => {
  let component: ViewViolationModalComponent;
  let fixture: ComponentFixture<ViewViolationModalComponent>;
  let orderServiceSpy: jasmine.SpyObj<OrderService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    orderServiceSpy = jasmine.createSpyObj('OrderService', ['getViolationOfCurrentOrder']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [ViewViolationModalComponent],
      imports: [MatSnackBarModule, TranslateModule.forRoot()],
      providers: [
        { provide: OrderService, useValue: orderServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: 'order123' }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewViolationModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should call orderService and set violationDetails', () => {
    const mockViolation: IViolation = {
      orderId: 'v1',
      violationLevel: ViolationLevel.LOW,
      images: ['img1.png', 'img2.png']
    } as unknown as IViolation;

    orderServiceSpy.getViolationOfCurrentOrder.and.returnValue(of(mockViolation));

    component.ngOnInit();

    expect(orderServiceSpy.getViolationOfCurrentOrder).toHaveBeenCalledWith('order123');
    expect(component.violationDetails).toEqual(mockViolation);
  });

  it('openImg should dialog.open', () => {
    component.violationDetails = {
      id: 'v1',
      level: ViolationLevel.HIGH,
      images: ['a.png', 'b.png']
    } as unknown as IViolation;

    component.openImg(1);

    expect(dialogSpy.open).toHaveBeenCalledWith(ShowImgsPopUpComponent, {
      hasBackdrop: true,
      panelClass: 'custom-img-pop-up',
      data: {
        imgIndex: 1,
        images: [{ src: 'a.png' }, { src: 'b.png' }]
      }
    });
  });
});
