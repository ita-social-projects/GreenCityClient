import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Place } from '../../component/places/models/place';
import { favoritePlaceLink, placeLink } from '../../links';
import { FavoritePlace } from '../../model/favorite-place/favorite-place';

import { FavoritePlaceService } from './favorite-place.service';

describe('FavoritePlaceService', () => {
  let service: FavoritePlaceService;
  let httpMock: HttpTestingController;
  let favoritePlace: FavoritePlace;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FavoritePlaceService]
    });

    service = TestBed.inject(FavoritePlaceService);
    httpMock = TestBed.inject(HttpTestingController);
    favoritePlace = { name: 'Park', placeId: 1 };
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
        lng: 2,
        id: 1,
        address: 'someAddress'
      },
      favorite: true
    };

    service.getFavoritePlaceWithLocation(1).subscribe((data) => {
      expect(data).toEqual(place);
    });

    const request = httpMock.expectOne(favoritePlaceLink + 'favorite/' + 1);
    expect(request.request.method).toBe('GET');

    request.flush(place);
  });

  it('saveFavoritePlace should post data', () => {
    service.saveFavoritePlace(favoritePlace).subscribe((res) => {
      expect(res).toEqual(favoritePlace);
    });

    const request = httpMock.expectOne(placeLink + 'save/favorite/');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(favoritePlace);

    request.flush(favoritePlace);
  });

  it('updateFavoritePlace should put data', () => {
    service.updateFavoritePlace(favoritePlace).subscribe((res) => {
      expect(res).toEqual(favoritePlace);
    });

    const request = httpMock.expectOne(favoritePlaceLink);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(favoritePlace);

    request.flush(favoritePlace);
  });

  it('deleteFavoritePlace should delete data by id', () => {
    service.deleteFavoritePlace(1).subscribe((res) => {
      expect(res).toBe(1);
    });

    const request = httpMock.expectOne(favoritePlaceLink + 1);
    expect(request.request.method).toBe('DELETE');

    request.flush(1);
  });
});
