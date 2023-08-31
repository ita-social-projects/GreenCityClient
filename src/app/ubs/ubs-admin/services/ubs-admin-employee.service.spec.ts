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
      name: 'fake',
      nameEn: 'fakeEn'
    }
  ];

  const allPermissionsMock = [
    'EDIT_DELETE_DEACTIVATE_PRICING_CARD',
    'EDIT_COURIER',
    'CREATE_NEW_CERTIFICATE',
    'REGISTER_A_NEW_EMPLOYEE',
    'CREATE_NEW_MESSAGE',
    'SEE_PRICING_CARD',
    'SEE_TARIFFS',
    'SEE_BIG_ORDER_TABLE',
    'SEE_MESSAGES_PAGE',
    'EDIT_ORDER',
    'SEE_EMPLOYEES_PAGE',
    'SEE_CERTIFICATES',
    'EDIT_CERTIFICATE',
    'SEE_CLIENTS_PAGE',
    'EDIT_STATION',
    'DEACTIVATE_EMPLOYEE',
    'CONTROL_SERVICE',
    'EDIT_LOCATION',
    'EDIT_EMPLOYEE',
    'EDIT_LOCATION',
    'EDIT_MESSAGE',
    'EDIT_EMPLOYEES_AUTHORITIES',
    'DELETE_MESSAGE',
    'CREATE_PRICING_CARD'
  ];

  const positionsAuthoritiesMock = {
    authorities: ['REGISTER_A_NEW_EMPLOYEE', 'EDIT_EMPLOYEE', 'EDIT_EMPLOYEES_AUTHORITIES', 'DEACTIVATE_EMPLOYEE'],
    positionId: [1, 2, 3, 4, 5, 6, 7]
  };

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

  it('should get all employee permissions', () => {
    const email = 'testemail@gmail.com';
    service.getAllEmployeePermissions(email).subscribe((data) => {
      expect(data).toBe(allPermissionsMock);
    });
    const req = httpMock.expectOne(`${urlMock}/get-all-authorities/?email=${email}`);
    expect(req.request.method).toBe('GET');
    req.flush(allPermissionsMock);
  });

  it('should get all employee positions authorities', () => {
    const email = 'testemail@gmail.com';
    service.getEmployeePositionsAuthorities(email).subscribe((data) => {
      expect(data).toBe(positionsAuthoritiesMock);
    });
    const req = httpMock.expectOne(`${urlMock}/get-positions-authorities/?email=${email}`);
    expect(req.request.method).toBe('GET');
    req.flush(positionsAuthoritiesMock);
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
