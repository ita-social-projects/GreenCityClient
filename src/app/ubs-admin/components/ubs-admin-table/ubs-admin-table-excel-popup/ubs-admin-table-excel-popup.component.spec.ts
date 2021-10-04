import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UbsAdminTableExcelPopupComponent } from './ubs-admin-table-excel-popup.component';
import { AdminTableService } from 'src/app/ubs-admin/services/admin-table.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('UbsAdminTableExcelPopupComponent', () => {
  let component: UbsAdminTableExcelPopupComponent;
  let fixture: ComponentFixture<UbsAdminTableExcelPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, TranslateModule.forRoot(), HttpClientTestingModule],
      declarations: [UbsAdminTableExcelPopupComponent],
      providers: [{ provide: AdminTableService, useValue: {} }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
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
