import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SubscriptionService } from './subscription.service';
import { subscriptionLink } from 'src/app/main/links';

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SubscriptionService]
    });

    service = TestBed.inject(SubscriptionService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should subscribe to newsletter', () => {
    const email = 'test@example.com';

    service.subscribeToNewsletter(email).subscribe();

    const req = httpTestingController.expectOne(`${subscriptionLink}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      email,
      subscriptionType: 'ECO_NEWS'
    });

    req.flush(null);
  });

  it('should unsubscribe', () => {
    const token = 'testToken';

    service.unsubscribe(token).subscribe();

    const req = httpTestingController.expectOne(`${subscriptionLink}/${token}`);
    expect(req.request.method).toBe('DELETE');

    req.flush(null);
  });
});
