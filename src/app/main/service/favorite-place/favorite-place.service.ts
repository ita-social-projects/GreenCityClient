import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { FavoritePlace } from '../../model/favorite-place/favorite-place';
import { favoritePlaceLink, placeLink } from '../../links';
import { Place } from '../../component/places/models/place';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FavoritePlaceService {
  favoritePlaces$: BehaviorSubject<Place[]> = new BehaviorSubject([]);

  constructor(private http: HttpClient) {}

  updateFavoritePlaces(isFromSideBar: boolean): void {
    if (!isFromSideBar) {
      this.http
        .get<Place[]>(favoritePlaceLink)
        .pipe(take(1))
        .subscribe((places: Place[]) => {
          this.favoritePlaces$.next(places);
        });
    }
  }

  addFavoritePlace(favoritePlaceSave: FavoritePlace, isFromSideBar?: boolean): void {
    this.http
      .post<FavoritePlace>(placeLink + 'save/favorite/', favoritePlaceSave)
      .pipe(take(1))
      .subscribe(() => {
        this.updateFavoritePlaces(isFromSideBar);
      });
  }

  deleteFavoritePlace(placeId: number, isFromSideBar?: boolean): void {
    this.http
      .delete<any>(`${favoritePlaceLink}${placeId}`)
      .pipe(take(1))
      .subscribe(() => {
        this.updateFavoritePlaces(isFromSideBar);
      });
  }
}
