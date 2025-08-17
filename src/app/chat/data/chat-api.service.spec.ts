import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChatApiService } from './chat-api.service';
import { environment } from '@environment/environment';

describe('ChatApiService', () => {
  let service: ChatApiService;
  let http: HttpTestingController;

  const baseUrl = `${environment.ubsAdmin.backendUbsAdminLink}/telegram`;
  const token = 'tok123';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ChatApiService]
    });
    service = TestBed.inject(ChatApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  const withToken = () => spyOn(localStorage, 'getItem').and.returnValue(token);
  const withoutToken = () => spyOn(localStorage, 'getItem').and.returnValue(null);

  it('getChats completes without request when no token', () => {
    withoutToken();
    let emitted = false;
    let completed = false;
    service.getChats(1, 10).subscribe({
      next: () => (emitted = true),
      complete: () => (completed = true)
    });
    http.expectNone(`${baseUrl}/chats`);
    expect(emitted).toBeFalse();
    expect(completed).toBeTrue();
  });

  it('getChats sends request with Authorization and pageable param', () => {
    withToken();
    service.getChats(2, 20).subscribe();
    const req = http.expectOne((r) => r.url === `${baseUrl}/chats`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    const pageable = JSON.parse(req.request.params.get('pageable') as string);
    expect(pageable).toEqual({ page: 2, size: 20, sort: ['sendAt,desc'] });
    req.flush({} as any);
  });

  it('getMessages completes without request when no token', () => {
    withoutToken();
    let completed = false;
    service.getMessages(55, 0, 50).subscribe({ complete: () => (completed = true) });
    http.expectNone(() => true);
    expect(completed).toBeTrue();
  });

  it('getMessages sends request with Authorization and correct query', () => {
    withToken();
    service.getMessages(77, 3, 15).subscribe();
    const req = http.expectOne(`${baseUrl}/messages/77?page=3&size=15&sort=sendAt,desc`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush({} as any);
  });

  it('sendMessage completes without request when no token', () => {
    withoutToken();
    let completed = false;
    service.sendMessage(10, 'hi').subscribe({ complete: () => (completed = true) });
    http.expectNone(() => true);
    expect(completed).toBeTrue();
  });

  it('sendMessage posts FormData with data only when no file', () => {
    withToken();
    service.sendMessage(10, 'hello').subscribe();
    const req = http.expectOne(`${baseUrl}/messages`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    expect(req.request.responseType).toBe('text');
    const body = req.request.body as FormData;
    expect(body instanceof FormData).toBeTrue();
    expect(body.has('data')).toBeTrue();
    expect(body.has('files')).toBeFalse();
    req.flush('ok');
  });

  it('sendMessage posts FormData with data and files when file provided', () => {
    withToken();
    const file = new File([new Blob(['x'])], 'a.txt', { type: 'text/plain' });
    service.sendMessage(11, 'with file', file).subscribe();
    const req = http.expectOne(`${baseUrl}/messages`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    const body = req.request.body as FormData;
    expect(body instanceof FormData).toBeTrue();
    expect(body.has('data')).toBeTrue();
    expect(body.has('files')).toBeTrue();
    req.flush('ok');
  });

  it('getLastOrder completes without request when no token', () => {
    withoutToken();
    let completed = false;
    service.getLastOrder(99).subscribe({ complete: () => (completed = true) });
    http.expectNone(() => true);
    expect(completed).toBeTrue();
  });

  it('getLastOrder sends request with Authorization and correct query', () => {
    withToken();
    service.getLastOrder(42).subscribe();
    const req = http.expectOne(`${baseUrl}/last-order?chatId=42`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush({} as any);
  });
});
