import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { UbsAdminOrderComponent } from './ubs-admin-order.component';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Store, StoreModule } from '@ngrx/store';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';

describe('UbsAdminCabinetComponent', () => {
  let component: UbsAdminOrderComponent;
  let fixture: ComponentFixture<UbsAdminOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        MatSnackBarModule,
        BrowserAnimationsModule,
        MatDialogModule,
        RouterTestingModule,
        HttpClientModule,
        StoreModule.forRoot({})
      ],
      declarations: [UbsAdminOrderComponent],
      providers: [MatSnackBarComponent, FormBuilder, provideMockStore({})]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
