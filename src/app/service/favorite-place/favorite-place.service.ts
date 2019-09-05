import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Place} from '../../model/place/place';
import {MapBounds} from '../../model/map/map-bounds';
import {FavoritePlace} from '../../model/favorite-place/favorite-place';
import {log} from 'util';

@Injectable({
  providedIn: 'root'
})
export class FavoritePlaceService {
  private baseUrl = 'https://greencitysoftserve.herokuapp.com/place/';
  private fp: FavoritePlace;

  constructor(private http: HttpClient) {
  }

  findAllByUserEmail(): Observable<FavoritePlace[]> {
    console.log('findAllByUserEmail');
    return this.http.get<FavoritePlace[]>(this.baseUrl);
  }
  updateFavoritePlace(favoritePlace: FavoritePlace){
    console.log('updateFavoritePlace');
    return this.http.put<FavoritePlace>(this.baseUrl, favoritePlace);
  }
  deleteFavoritePlace(id: bigint) {
    console.log('deleteFavoritePlace');
    this.fp = new FavoritePlace(id, '');
    return this.http.delete<any>(`${this.baseUrl}${id}/`);
  }
}
