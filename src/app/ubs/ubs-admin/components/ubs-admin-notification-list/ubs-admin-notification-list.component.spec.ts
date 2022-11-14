import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';

import { UbsAdminNotificationListComponent } from './ubs-admin-notification-list.component';

describe('UbsAdminNotificationListComponent', () => {
  let component: UbsAdminNotificationListComponent;
  let fixture: ComponentFixture<UbsAdminNotificationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminNotificationListComponent],
      imports: [RouterTestingModule, HttpClientTestingModule, MatAutocompleteModule, NgxPaginationModule, TranslateModule.forRoot()],
      providers: [FormBuilder]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminNotificationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
