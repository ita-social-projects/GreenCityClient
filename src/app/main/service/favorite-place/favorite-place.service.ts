import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { FavoritePlace } from '../../model/favorite-place/favorite-place';
import { favoritePlaceLink, placeLink } from '../../links';
import { Place } from '../../component/places/models/place';

@Injectable({
  providedIn: 'root'
})
export class FavoritePlaceService {
  favoritePlaces: FavoritePlace[] = [];
  subject = new Subject();

  constructor(private http: HttpClient) {}

  findAllByUserEmail(): Observable<FavoritePlace[]> {
    return this.http.get<FavoritePlace[]>(favoritePlaceLink);
  }

  saveFavoritePlace(favoritePlaceSave: FavoritePlace) {
    return this.http.post<FavoritePlace>(placeLink + 'save/favorite/', favoritePlaceSave);
  }

  updateFavoritePlace(favoritePlace: FavoritePlace) {
    return this.http.put<FavoritePlace>(favoritePlaceLink, favoritePlace);
  }

  deleteFavoritePlace(placeId: number) {
    return this.http.delete<any>(`${favoritePlaceLink}${placeId}`);
  }

  getFavoritePlaceWithLocation(placeId: number): Observable<Place> {
    return this.http.get<any>(favoritePlaceLink + 'favorite/' + placeId);
  }

  getFavoritePlaces() {
    this.findAllByUserEmail().subscribe((res) => {
      this.favoritePlaces = res;
    });
  }
}
