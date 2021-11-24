import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule, PaginatePipe } from 'ngx-pagination';

import { UbsAdminEmployeeComponent } from './ubs-admin-employee.component';

fdescribe('UbsAdminEmployeeComponent', () => {
  let component: UbsAdminEmployeeComponent;
  let fixture: ComponentFixture<UbsAdminEmployeeComponent>;
  let activatedRoute: ActivatedRoute;
  let dialog: MatDialog;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminEmployeeComponent, PaginatePipe],
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule, MatDialogModule, NgxPaginationModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminEmployeeComponent);
    component = fixture.componentInstance;
    activatedRoute = TestBed.inject(ActivatedRoute);
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
