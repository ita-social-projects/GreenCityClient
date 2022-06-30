import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UbsAdminEmployeeDeletePopUpComponent } from './ubs-admin-employee-delete-pop-up.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

describe('UbsAdminEmployeeDeletePopUpComponent', () => {
  let component: UbsAdminEmployeeDeletePopUpComponent;
  let fixture: ComponentFixture<UbsAdminEmployeeDeletePopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminEmployeeDeletePopUpComponent],
      imports: [MatDialogModule, HttpClientTestingModule, TranslateModule.forRoot()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminEmployeeDeletePopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
