import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subscription} from 'rxjs';
import {FavoritePlace} from '../../model/favorite-place/favorite-place';
import {favoritePlaceLink} from '../../links';
import {placeLink} from '../../links';
import {FavoritePlaceSave} from '../../model/favorite-place/favorite-place-save';
import {Place} from '../../model/place/place';

@Injectable({
  providedIn: 'root'
})
export class FavoritePlaceService {

  private fp: FavoritePlace;
  pl: Subscription;

  constructor(private http: HttpClient) {
  }

  findAllByUserEmail(): Observable<FavoritePlace[]> {
    console.log('findAllByUserEmail');
    return this.http.get<FavoritePlace[]>(favoritePlaceLink);
  }

  findAllByUserEmailWithPlaceId(): Observable<FavoritePlaceSave[]> {
    console.log('findAllByUserEmailWithPlaceId');
    return this.http.get<any>(favoritePlaceLink + 'with_place_id');
  }

  saveFavoritePlace(favoritePlaceSave: FavoritePlaceSave) {
    console.log('service favorite-place savePlaceAsFavorite placeId=' + favoritePlaceSave.placeId +
      ' link=' + placeLink + 'save/favorite/');
    return this.http.post<FavoritePlaceSave>(placeLink + 'save/favorite/', favoritePlaceSave);
  }

  updateFavoritePlace(favoritePlace: FavoritePlace) {
    console.log('updateFavoritePlace id=' + favoritePlace.id + ' name=' + favoritePlace.name + ' link=' + favoritePlaceLink);
    return this.http.put<FavoritePlace>(favoritePlaceLink, favoritePlace);
  }

  deleteFavoritePlace(id: number) {
    console.log('deleteFavoritePlace id=' + id);
    this.fp = new FavoritePlace(id, '');
    return this.http.delete<any>(`${favoritePlaceLink}${id}/`);
  }

  getFavoritePlaceWithLocation(id: number): Observable<Place> {
    console.log('getFavoritePlaceWithLocation id=' + id);
    // this.pl = this.http.get<Place>(favoritePlaceLink + 'favorite/' + id).subscribe();
    // // console.log('getFavoritePlaceWithLocation place=' +this.pl.);

    return this.http.get<any>(favoritePlaceLink + 'favorite/' + id);
  }
}
