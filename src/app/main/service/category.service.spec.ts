import { TestBed } from '@angular/core/testing';
import { CategoryService } from './category.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoryDto } from '../model/category.model';
import { environment } from '@environment/environment';

describe('Category Service', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;
  let category: CategoryDto;
  const mainLink = environment.backendLink;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CategoryService]
    });
    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
    category = { name: 'Animal' };
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create an instance', () => {
    expect(service).toBeTruthy();
  });

  it('should return all categories', () => {
    service.findAllCategory().subscribe((value) => {
      expect(value).toBe(category);
    });
    const req = httpMock.expectOne(`${mainLink}category`);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.responseType).toEqual('json');
    expect(req.request.method).toBe('GET');
    req.flush(category);
  });

  it('should save current category', () => {
    category = { name: 'Dances' };
    service.save(category).subscribe((value) => {
      expect(value).toBe(category);
    });
    const req = httpMock.expectOne(`${mainLink}category`);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.responseType).toEqual('json');
    expect(req.request.method).toBe('POST');
    req.flush(category);
  });
});
