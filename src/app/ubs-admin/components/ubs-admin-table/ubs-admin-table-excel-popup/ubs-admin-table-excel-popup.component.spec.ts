import { TranslateModule } from '@ngx-translate/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UbsAdminTableExcelPopupComponent } from './ubs-admin-table-excel-popup.component';

describe('UbsAdminTableExcelPopupComponent', () => {
  let component: UbsAdminTableExcelPopupComponent;
  let fixture: ComponentFixture<UbsAdminTableExcelPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminTableExcelPopupComponent],
      imports: [FormsModule, ReactiveFormsModule, TranslateModule.forRoot()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminTableExcelPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
