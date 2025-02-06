import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsubscribeComponent } from './unsubscribe.component';
import { of, throwError } from 'rxjs';
import { SubscriptionService } from '@global-service/subscription/subscription.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

describe('UnsubscribeComponent', () => {
  let component: UnsubscribeComponent;
  let fixture: ComponentFixture<UnsubscribeComponent>;
  const subscriptionServiceMock = jasmine.createSpyObj('SubscriptionService', ['unsubscribe']);
  const activatedRouteMock = {
    queryParams: of({ token: 'test-token', type: 'newsletter' })
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [UnsubscribeComponent],
      providers: [
        { provide: SubscriptionService, useValue: subscriptionServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    });
    fixture = TestBed.createComponent(UnsubscribeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with query parameters', () => {
    expect(component.token).toBe('test-token');
    expect(component.type).toBe('newsletter');
  });

  it('should return dynamic translation key', () => {
    component.type = 'newsletter';
    expect(component.getDynamicTranslationKey()).toBe('homepage.subscription.type.newsletter');
  });

  it('should set success state when unsubscribe is successful', () => {
    subscriptionServiceMock.unsubscribe.and.returnValue(of(null));
    component.onUnsubscribe();

    expect(component.isLoading).toBeFalse();
    expect(component.isSuccess).toBeTrue();
  });

  it('should set error state when unsubscribe fails', () => {
    subscriptionServiceMock.unsubscribe.and.returnValue(throwError(() => 'error'));
    component.onUnsubscribe();

    expect(component.isLoading).toBeFalse();
    expect(component.isError).toBeTrue();
  });
});
