import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Place} from '../../model/place/place';
import {MapBounds} from '../../model/map/map-bounds';
import {FavoritePlace} from '../../model/favorite-place/favorite-place';
import {log} from 'util';
import {favoritePlaceLink} from '../../links';
import {placeLink} from '../../links';
import {FavoritePlaceSave} from '../../model/favorite-place/favorite-place-save';
import {mainLink} from '../../links';

@Injectable({
  providedIn: 'root'
})
export class FavoritePlaceService {

  private fp: FavoritePlace;

  constructor(private http: HttpClient) {
  }

  findAllByUserEmail(): Observable<FavoritePlace[]> {
    console.log('findAllByUserEmail');
    return this.http.get<FavoritePlace[]>(favoritePlaceLink);
  }
  saveFavoritePlace(favoritePlaceSave: FavoritePlaceSave) {
    console.log('service favorite-place savePlaceAsFavorite placeId=' + favoritePlaceSave.placeId +
      ' link=' + placeLink + "save/favorite/");
    return this.http.post<FavoritePlaceSave>(placeLink + "save/favorite/", favoritePlaceSave);
  }
  updateFavoritePlace(favoritePlace: FavoritePlace) {
    console.log('updateFavoritePlace id=' + favoritePlace.id + ' name=' + favoritePlace.name + ' link=' + favoritePlaceLink);
    return this.http.put<FavoritePlace>(favoritePlaceLink, favoritePlace);
  }
  deleteFavoritePlace(id: number) {
    console.log('deleteFavoritePlace');
    this.fp = new FavoritePlace(id, '');
    return this.http.delete<any>(`${favoritePlaceLink}${id}/`);
  }
}
