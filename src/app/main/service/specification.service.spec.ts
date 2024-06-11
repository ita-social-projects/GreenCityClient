import { TestBed } from '@angular/core/testing';
import { SpecificationService } from './specification.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '@environment/environment';

describe('Specification Service', () => {
  let specificationService: SpecificationService;
  let httpMock: HttpTestingController;
  const mainLink = environment.backendLink;
  const specification = [{ name: 'Animal' }];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SpecificationService]
    });
    specificationService = TestBed.inject(SpecificationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create an instance', () => {
    expect(specificationService).toBeTruthy();
  });

  it('should return all specifications', () => {
    specificationService.findAllSpecification().subscribe((value) => {
      expect(value).toBe(specification);
    });
    const req = httpMock.expectOne(`${mainLink}specification`);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.responseType).toEqual('json');
    expect(req.request.method).toBe('GET');
    req.flush(specification);
  });
});
