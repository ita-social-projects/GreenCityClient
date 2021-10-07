import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TariffsService } from './tariffs.service';
import { mainUbsLink } from '../../main/links';

const tariff = {
  name: 'fake',
  capacity: 1,
  price: 1,
  commission: 1,
  description: 'fake'
};

describe('TariffsService', () => {
  let service: TariffsService;
  let httpMock: HttpTestingController;

  function httpTest(url, type, response) {
    const req = httpMock.expectOne(`${mainUbsLink}` + url);
    expect(req.request.method).toBe(type);
    req.flush(response);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TariffsService],
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(TariffsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get tariff for a service', () => {
    service.getAllTariffsService().subscribe((data) => {
      expect(data).toBe(tariff);
    });

    httpTest('/ubs/superAdmin/getTariffService', 'GET', tariff);
  });

  it('should crate new service', () => {
    service.createNewService(tariff).subscribe((data) => {
      expect(data).toBe(tariff);
    });

    const request = httpMock.expectOne(mainUbsLink + '/ubs/superAdmin/createTariffService');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(tariff);
    request.flush(tariff);
  });

  it('should delete service ', () => {
    const id = 1;
    service.deleteService(id).subscribe((data) => {
      expect(data).toEqual(0);
    });
    httpTest('/ubs/superAdmin/deleteTariffService/1', 'DELETE', 0);
  });

  it('should edit service', () => {
    service.editService(1, tariff).subscribe((data) => {
      expect(data).toBe(tariff);
    });
    httpTest('/ubs/superAdmin/editTariffService/1', 'PUT', tariff);
  });
});
