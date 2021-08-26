import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FavoritePlace } from '@global-models/favorite-place/favorite-place';
import { Place } from '../../component/places/models/place';
import { favoritePlaceLink } from '../../links';

import { FavoritePlaceService } from './favorite-place.service';

fdescribe('FavoritePlaceService', () => {
  let service: FavoritePlaceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FavoritePlaceService]
    });

    service = TestBed.inject(FavoritePlaceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  it('findAllByUserEmail should return array with data', () => {
    const expectedData: FavoritePlace[] = [
      { name: 'Max', placeId: 1 },
      { name: 'Anna', placeId: 2 }
    ];

    service.findAllByUserEmail().subscribe((data) => {
      expect(data.length).toBe(2);
      expect(data).toEqual(expectedData);
    });

    const request = httpMock.expectOne(favoritePlaceLink);

    expect(request.request.method).toBe('GET');

    request.flush(expectedData);
  });

  it('getFavoritePlaceWithLocation should return Place object ', () => {
    const place: Place = {
      id: 1,
      name: 'some name',
      location: {
        lat: 1,
        lng: 2
      },
      favorite: true,
      color: 'star-yellow'
    };

    service.getFavoritePlaceWithLocation(1).subscribe((data) => {
      expect(data?.color).toBeTruthy();
      expect(data).toEqual(place);
    });

    const request = httpMock.expectOne(favoritePlaceLink + 'favorite/' + 1);

    expect(request.request.method).toBe('GET');

    request.flush(place);
  });
});
