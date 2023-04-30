import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TariffsService } from './tariffs.service';
import { mainUbsLink } from '../../../main/links';
import { DatePipe } from '@angular/common';

const service1 = {
  name: 'fake1',
  nameEng: 'fake',
  price: 2,
  description: 'fake1',
  descriptionEng: 'fake1',
  tariffId: 1
};

const tariff = {
  name: 'fake',
  capacity: 1,
  price: 1,
  commission: 1,
  description: 'fake'
};

const location = [
  {
    locationsDto: [
      {
        latitude: 12,
        locationId: 1,
        locationStatus: 'фейк',
        locationTranslationDtoList: [
          { languageCode: 'ua', locationName: 'Фейк1' },
          { languageCode: 'en', locationName: 'Fake1' }
        ],
        longitude: 13
      }
    ],
    regionId: 1,
    regionTranslationDtos: [
      { regionName: 'Фейк область', languageCode: 'ua' },
      { regionName: 'Fake region', languageCode: 'en' }
    ]
  }
];

const courier = {
  courierId: 1,
  courierStatus: 'fake',
  courierTranslationDtos: [
    {
      languageCode: 'fake',
      name: 'fake'
    }
  ],
  createDate: 'fake',
  createdBy: 'fake'
};

const info = {
  bagId: 0,
  courierId: 0,
  courierLimitsBy: 'fake',
  languageId: 0,
  limitDescription: 'fake',
  maxAmountOfBigBag: 0,
  maxAmountOfOrder: 0,
  minAmountOfBigBag: 0,
  minAmountOfOrder: 0,
  minimalAmountOfBagStatus: 'fake'
};

const station = {
  id: 1,
  name: 'fake'
};

const editLocation = {
  nameEn: 'name',
  nameUa: 'назва',
  locationId: 1
};

const filterData = { status: 'ACTIVE' };

const card = {
  courierId: 1,
  locationIdList: [1, 2],
  receivingStationsIdList: [1, 2],
  regionId: 2
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

  it('should delete service ', () => {
    const id = 1;
    service.deleteService(id).subscribe((data) => {
      expect(data).toEqual(0);
    });
    httpTest('/ubs/superAdmin/deleteService/1', 'DELETE', 0);
  });

  it('should get all tariffs', () => {
    service.getAllTariffsForService(5).subscribe((data) => {
      expect(data).toBe(tariff);
    });

    httpTest('/ubs/superAdmin/5/getTariffService', 'GET', tariff);
  });

  it('should transform date', () => {
    const date = new Date(2022, 11, 10);
    const datePipe = new DatePipe('ua');
    const result = datePipe.transform(date, 'MMM dd, yyyy');
    expect(result).toEqual('груд. 10, 2022');
  });

  it('should create new tariff', () => {
    service.createNewTariffForService(tariff, 1).subscribe((data) => {
      expect(data).toBe(tariff);
    });

    const request = httpMock.expectOne(mainUbsLink + '/ubs/superAdmin/1/createTariffService');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(tariff);
    request.flush(tariff);
  });

  it('should delete tariff ', () => {
    const id = 1;
    service.deleteTariffForService(id).subscribe((data) => {
      expect(data).toEqual(0);
    });
    httpTest('/ubs/superAdmin/deleteTariffService/1', 'DELETE', 0);
  });

  it('should edit tariff', () => {
    service.editTariffForService(1, tariff).subscribe((data) => {
      expect(data).toBe(tariff);
    });
    httpTest('/ubs/superAdmin/editTariffService/1', 'PUT', tariff);
  });

  it('should crate new service', () => {
    service.createService(service1, 1).subscribe((data) => {
      expect(data).toBe(service1);
    });

    const request = httpMock.expectOne(mainUbsLink + '/ubs/superAdmin/1/createService');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(service1);
    request.flush(service1);
  });

  it('should get tariff for a service', () => {
    service.getService(1).subscribe((data) => {
      expect(data).toBe(service1);
    });

    httpTest(`/ubs/superAdmin/1/getService`, 'GET', service1);
  });

  it('should edit service', () => {
    service.editService(service1, 1).subscribe((data) => {
      expect(data).toBe(service1);
    });
    httpTest('/ubs/superAdmin/editService/1', 'PUT', service1);
  });

  it('should return all locations', () => {
    service.getLocations().subscribe((data) => {
      expect(data).toBe(location);
    });

    httpTest('/ubs/superAdmin/getLocations', 'GET', location);
  });

  it('should return active locations', () => {
    service.getActiveLocations().subscribe((data) => {
      expect(data).toBe(location);
    });

    httpTest('/ubs/superAdmin/getActiveLocations', 'GET', location);
  });

  it('should return all couriers', () => {
    service.getCouriers().subscribe((data) => {
      expect(data).toBe(courier as any);
    });

    httpTest('/ubs/superAdmin/getCouriers', 'GET', courier);
  });

  it('should edit info', () => {
    service.editInfo(info).subscribe((data) => {
      expect(data).toBe(info);
    });

    httpTest('/ubs/superAdmin/editInfoAboutTariff', 'PATCH', info);
  });

  it('should add location', () => {
    service.addLocation(location).subscribe((data) => {
      expect(data).toBe(location);
    });

    httpTest('/ubs/superAdmin/addLocations', 'POST', location);
  });

  it('should return all stations', () => {
    service.getAllStations().subscribe((data) => {
      expect(data).toBe(station as any);
    });

    httpTest('/ubs/superAdmin/get-all-receiving-station', 'GET', station);
  });

  it('should add station', () => {
    service.addStation('station').subscribe((data) => {
      expect(data).toBe('station');
    });

    httpTest('/ubs/superAdmin/create-receiving-station?name=station', 'POST', 'station');
  });

  it('should add courier', () => {
    service.addCourier(courier).subscribe((data) => {
      expect(data).toBe(courier);
    });

    httpTest('/ubs/superAdmin/createCourier', 'POST', courier);
  });

  it('should edit station', () => {
    service.editStation(station).subscribe((data) => {
      expect(data).toBe(station);
    });
    httpTest('/ubs/superAdmin/update-receiving-station', 'PUT', station);
  });

  it('should edit courier', () => {
    service.editCourier(courier).subscribe((data) => {
      expect(data).toBe(courier);
    });
    httpTest('/ubs/superAdmin/update-courier', 'PUT', courier);
  });

  it('should edit location name', () => {
    service.editLocationName([editLocation]).subscribe((data) => {
      expect(data).toEqual([editLocation]);
    });
    httpTest('/ubs/superAdmin/locations/edit', 'POST', [editLocation]);
  });

  it('should return filtered card', () => {
    service.getFilteredCard(filterData).subscribe((data) => {
      expect(data).toEqual([]);
    });
    httpTest('/ubs/superAdmin/tariffs?status=ACTIVE', 'GET', []);
  });

  it('should get card info', () => {
    service.getCardInfo().subscribe((data) => {
      expect(data).toEqual([]);
    });
    httpTest('/ubs/superAdmin/tariffs', 'GET', []);
  });

  it('should create card', () => {
    service.createCard(card).subscribe((data) => {
      expect(data).toBe(card);
    });
    httpTest('/ubs/superAdmin/add-new-tariff', 'POST', card);
  });

  it('should check if card exist', () => {
    service.checkIfCardExist(card).subscribe((data) => {
      expect(data).toBe(card);
    });
    httpTest('/ubs/superAdmin/check-if-tariff-exists', 'POST', card);
  });
});
