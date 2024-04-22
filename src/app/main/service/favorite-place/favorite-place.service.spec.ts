import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Place } from '../../component/places/models/place';
import { favoritePlaceLink, placeLink } from '../../links';
import { FavoritePlace } from '../../model/favorite-place/favorite-place';

import { FavoritePlaceService } from './favorite-place.service';

describe('FavoritePlaceService', () => {
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

  it('should update favoritePlaces', () => {
    const expectedData: FavoritePlace[] = [
      { name: 'place1', placeId: 1 },
      { name: 'place2', placeId: 2 }
    ];

    let favoritePlaces;

    service.favoritePlaces$.subscribe((places: Place[]) => {
      favoritePlaces = places;
    });

    service.updateFavoritePlaces(false);

    const request = httpMock.expectOne(favoritePlaceLink);

    expect(request.request.method).toEqual('GET');

    request.flush(expectedData);

    expect(favoritePlaces).toEqual(expectedData);
  });

  it('should add favoritePlace', () => {
    const favoritePlaceMock: FavoritePlace = { name: 'place1', placeId: 1 };

    spyOn(service, 'updateFavoritePlaces').and.callFake(() => {});

    service.addFavoritePlace(favoritePlaceMock);

    const request = httpMock.expectOne(`${placeLink}save/favorite/`);

    expect(request.request.method).toEqual('POST');

    expect(request.request.body).toEqual(favoritePlaceMock);
    request.flush({});

    expect(service.updateFavoritePlaces).toHaveBeenCalledTimes(1);
  });

  it('should delete favoritePlace', () => {
    const placeIdMock = 5;

    spyOn(service, 'updateFavoritePlaces').and.callFake(() => {});

    service.deleteFavoritePlace(placeIdMock);

    const request = httpMock.expectOne(`${favoritePlaceLink}${placeIdMock}`);

    expect(request.request.method).toEqual('DELETE');
    request.flush({});

    expect(service.updateFavoritePlaces).toHaveBeenCalledTimes(1);
  });
});
