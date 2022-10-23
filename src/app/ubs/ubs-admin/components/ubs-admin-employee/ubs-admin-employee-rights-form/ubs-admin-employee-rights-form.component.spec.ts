import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UbsAdminEmployeeRightsFormComponent } from './ubs-admin-employee-rights-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatCheckboxModule } from '@angular/material/checkbox';

describe('UbsAdminEmployeeRightsFormComponent', () => {
  let component: UbsAdminEmployeeRightsFormComponent;
  let fixture: ComponentFixture<UbsAdminEmployeeRightsFormComponent>;

  const mockedEmployee = { email: 'aaaa@gmail.com' };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminEmployeeRightsFormComponent],
      imports: [CdkAccordionModule, TranslateModule.forRoot(), ReactiveFormsModule, HttpClientModule, MatCheckboxModule],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: mockedEmployee }, FormBuilder]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminEmployeeRightsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
