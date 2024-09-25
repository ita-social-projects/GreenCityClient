import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UbsOrderAddressComponent } from './ubs-order-address.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { SpinnerComponent } from 'src/app/shared/spinner/spinner.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';

describe('UbsOrderAddressComponent', () => {
  let component: UbsOrderAddressComponent;
  let fixture: ComponentFixture<UbsOrderAddressComponent>;

  const storeMock = {
    dispatch: jasmine.createSpy(),
    select: jasmine.createSpy().and.returnValue(of({})),
    pipe: () => of({})
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UbsOrderAddressComponent, SpinnerComponent],
      imports: [TranslateModule.forRoot(), MatProgressSpinnerModule, ReactiveFormsModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ existingOrderId: '123' })
          }
        },
        {
          provide: MatDialog,
          useValue: {
            open: () => {}
          }
        },
        {
          provide: Store,
          useValue: storeMock
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsOrderAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
