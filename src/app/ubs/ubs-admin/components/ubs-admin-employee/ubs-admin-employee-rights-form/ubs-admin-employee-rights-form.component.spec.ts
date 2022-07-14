import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UbsAdminEmployeeRightsFormComponent } from './ubs-admin-employee-rights-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { CdkAccordionModule } from '@angular/cdk/accordion';

describe('UbsAdminEmployeeRightsFormComponent', () => {
  let component: UbsAdminEmployeeRightsFormComponent;
  let fixture: ComponentFixture<UbsAdminEmployeeRightsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminEmployeeRightsFormComponent],
      imports: [CdkAccordionModule, TranslateModule.forRoot()]
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
