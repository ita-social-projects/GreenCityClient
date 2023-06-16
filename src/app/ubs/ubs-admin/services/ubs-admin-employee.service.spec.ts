import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { UbsAdminEmployeeService } from './ubs-admin-employee.service';
import { environment } from '@environment/environment.js';

describe('UbsAdminEmployeeService', () => {
  let httpMock: HttpTestingController;
  let service: UbsAdminEmployeeService;

  const urlMock = environment.backendUbsLink + '/admin/ubs-employee';
  const urlMockStation = environment.backendUbsLink + '/ubs/superAdmin';

  const employeeMock = {
    currentPage: 0,
    first: true,
    hasNext: true,
    hasPrevious: true,
    last: true,
    number: 0,
    content: [],
    totalElements: 0,
    totalPages: 0
  };
  const positionMock = [
    {
      id: 0,
      name: 'fake'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(UbsAdminEmployeeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all employees', () => {
    service.getEmployees(0, 10).subscribe((data: any) => {
      expect(data).toEqual(employeeMock as any);
    });
    const req = httpMock.expectOne(`${urlMock}/getAll-employees?pageNumber=0&pageSize=10`);
    expect(req.request.method).toBe('GET');
    req.flush(employeeMock);
  });

  it('should get all postitions', () => {
    service.getAllPositions().subscribe((data) => {
      expect(data).toBe(positionMock);
    });
    const req = httpMock.expectOne(`${urlMock}/get-all-positions`);
    expect(req.request.method).toBe('GET');
    req.flush(positionMock);
  });

  it('should get all stations', () => {
    service.getAllStations().subscribe((data) => {
      expect(data).toBe(positionMock);
    });
    const req = httpMock.expectOne(`${urlMockStation}/get-all-receiving-station`);
    expect(req.request.method).toBe('GET');
    req.flush(positionMock);
  });

  it('should add employee', () => {
    service.postEmployee(employeeMock).subscribe((data) => {
      expect(data).toBe(employeeMock);
    });
    const req = httpMock.expectOne(`${urlMock}/save-employee`);
    expect(req.request.method).toBe('POST');
    req.flush(employeeMock);
  });

  it('should update employee', () => {
    service.updateEmployee(employeeMock).subscribe((data) => {
      expect(data).toBe(employeeMock);
    });
    const req = httpMock.expectOne(`${urlMock}/update-employee`);
    expect(req.request.method).toBe('PUT');
    req.flush(employeeMock);
  });

  it('should delete employee image', () => {
    service.deleteEmployeeImage(1).subscribe((data) => {
      expect(data).toBe(employeeMock);
    });
    const req = httpMock.expectOne(`${urlMock}/delete-employee-image/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(employeeMock);
  });

  it('should delete employee', () => {
    service.deleteEmployee(1).subscribe((data) => {
      expect(data).toBe(employeeMock);
    });
    const req = httpMock.expectOne(`${urlMock}/deactivate-employee/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(employeeMock);
  });
});
