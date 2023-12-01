import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SubscribeComponent } from './subscribe.component';
import { SubscriptionService } from '@global-service/subscription/subscription.service';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('SubscribeComponent', () => {
  let component: SubscribeComponent;
  let fixture: ComponentFixture<SubscribeComponent>;

  let fakeSubscriptionService: SubscriptionService;
  fakeSubscriptionService = jasmine.createSpyObj('fakeSub', ['subscribeToNewsletter']);
  fakeSubscriptionService.subscriptionError = of('sth');

  const emailMock = 'example12@gamil.com';

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SubscribeComponent],
      imports: [TranslateModule.forRoot(), FormsModule],
      providers: [
        {
          provide: SubscriptionService,
          useValue: fakeSubscriptionService
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscribeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('method ngOnInit should assign subscriptionError to new subscriptionError', (done) => {
    fakeSubscriptionService.subscriptionError.subscribe((result) => {
      expect(result).toBe('sth');
      expect(result).toBeTruthy();
      done();
    });
  });

  it('should check if email is valid', () => {
    component.email = emailMock;
    component.validateEmail();
    expect(component.emailValid).toBeTruthy();
  });

  it('should call subscribe', () => {
    component.emailValid = true;
    component.subscribe();
    expect(fakeSubscriptionService.subscribeToNewsletter).toHaveBeenCalled();
    expect(component.emailTouched).toBeFalsy();
  });
});
