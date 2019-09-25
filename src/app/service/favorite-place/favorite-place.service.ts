import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FavoritePlace} from '../../model/favorite-place/favorite-place';
import {favoritePlaceLink} from '../../links';
import {placeLink} from '../../links';
import {Place} from '../../model/place/place';

@Injectable({
  providedIn: 'root'
})
export class FavoritePlaceService {

  constructor(private http: HttpClient) {
  }

  findAllByUserEmail(): Observable<FavoritePlace[]> {
    console.log('findAllByUserEmail');
    return this.http.get<FavoritePlace[]>(favoritePlaceLink);
  }

  // findAllByUserEmailWithPlaceId(): Observable<FavoritePlace[]> {
  //   console.log('findAllByUserEmailWithPlaceId');
  //   return this.http.get<any>(favoritePlaceLink + 'with_place_id');
  // }

  saveFavoritePlace(favoritePlaceSave: FavoritePlace) {
    console.log('service favorite-place savePlaceAsFavorite placeId=' + favoritePlaceSave.placeId +
      ' link=' + placeLink + 'save/favorite/');
    return this.http.post<FavoritePlace>(placeLink + 'save/favorite/', favoritePlaceSave);
  }

  updateFavoritePlace(favoritePlace: FavoritePlace) {
    console.log('updateFavoritePlace placeId=' + favoritePlace.placeId + ' name=' + favoritePlace.name + ' link=' + favoritePlaceLink);
    return this.http.put<FavoritePlace>(favoritePlaceLink, favoritePlace);
  }

  deleteFavoritePlace(placeId: number) {
    console.log('deleteFavoritePlace placeId=' + placeId);
    return this.http.delete<any>(`${favoritePlaceLink}${placeId}/`);
  }

  getFavoritePlaceWithLocation(placeId: number): Observable<Place> {
    console.log('getFavoritePlaceWithLocation placeId=' + placeId);
    return this.http.get<any>(favoritePlaceLink + 'favorite/' + placeId);
  }
}
