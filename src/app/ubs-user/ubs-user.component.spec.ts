import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IMaskModule } from 'angular-imask';

import { UbsUserComponent } from './ubs-user.component';

describe('UbsUserComponent', () => {
  let component: UbsUserComponent;
  let fixture: ComponentFixture<UbsUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsUserComponent],
      imports: [IMaskModule, TranslateModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
