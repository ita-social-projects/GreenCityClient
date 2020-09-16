import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ChangePasswordService } from '@auth-service/change-password.service';
import { ConfirmRestorePasswordComponent } from './confirm-restore-password.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';


describe('ConfirmRestorePasswordComponent', () => {
  let component: ConfirmRestorePasswordComponent;
  let fixture: ComponentFixture<ConfirmRestorePasswordComponent>;

  const ChangePasswordServiceStub = {
    restorePassword: jasmine.createSpy('restorePassword')
  };

  class Fake {
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmRestorePasswordComponent ],
      imports: [
        FormsModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([{
          path: 'welcome',
          component: Fake
        }]),
        ],
      providers: [{
        provide: ChangePasswordService,
        useValue: ChangePasswordServiceStub
      }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmRestorePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create ConfirmRestorePasswordComponent', () => {
    expect(component).toBeTruthy();
  });
});
