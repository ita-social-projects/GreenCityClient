import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubscribeComponent } from './subscribe.component';
import { SubscriptionService } from '@global-service/subscription/subscription.service';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';

describe('SubscribeComponent', () => {
  let component: SubscribeComponent;
  let fixture: ComponentFixture<SubscribeComponent>;

  const emailMock = 'example12@gmail.com';
  const subscriptionServiceMock = jasmine.createSpyObj('SubscriptionService', ['subscribeToNewsletter']);
  const snackBarMock = jasmine.createSpyObj('MatSnackBarComponent', ['openSnackBar']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubscribeComponent],
      imports: [TranslateModule.forRoot(), FormsModule],
      providers: [
        { provide: SubscriptionService, useValue: subscriptionServiceMock },
        { provide: MatSnackBarComponent, useValue: snackBarMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SubscribeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    subscriptionServiceMock.subscribeToNewsletter.calls.reset();
    snackBarMock.openSnackBar.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate valid email', () => {
    component.email = emailMock;
    component.validateEmail();
    expect(component.emailTouched).toBeTrue();
    expect(component.emailValid).toBeTrue();
  });

  it('should invalidate incorrect email', () => {
    component.email = 'invalid-email';
    component.validateEmail();
    expect(component.emailTouched).toBeTrue();
    expect(component.emailValid).toBeFalse();
  });

  it('should reset email fields after successful subscription', () => {
    component.email = emailMock;
    component.emailValid = true;

    subscriptionServiceMock.subscribeToNewsletter.and.returnValue(new BehaviorSubject(null));

    component.subscribeToNewsletter();

    expect(component.emailTouched).toBeFalse();
    expect(component.emailValid).toBeFalse();
    expect(component.email).toBe('');
    expect(snackBarMock.openSnackBar).toHaveBeenCalledWith('subscribedToNewsletter');
  });

  it('should not subscribe to newsletter when email is invalid', () => {
    component.email = 'invalid-email';
    component.validateEmail();

    component.subscribeToNewsletter();

    expect(component.emailTouched).toBeTrue();
    expect(component.emailValid).toBeFalse();
    expect(subscriptionServiceMock.subscribeToNewsletter).not.toHaveBeenCalled();
  });
});
