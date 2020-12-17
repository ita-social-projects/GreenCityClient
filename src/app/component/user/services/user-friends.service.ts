import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { FriendModel, FriendRecommendedModel } from '@global-user/models/friend.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserFriendsService {
  private url: string = environment.backendLink;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  public getRecommendedFriends(id: number, page = 0, size = 10): Observable<FriendRecommendedModel> {
    return this.http.get<FriendRecommendedModel>(`${this.url}user/${id}/recommendedFriends/?page=${page}&size=${size}`);
  }

  public getSixFriends(userId: number): Observable<FriendModel[]> {
    return this.http.get<FriendModel[]>(`${this.url}user/${userId}/sixUserFriends/`);
  }

  public getAllFriends(userId: number, page = 0, size = 10): Observable<FriendRecommendedModel[]> {
    return this.http.get<FriendRecommendedModel[]>(`${this.url}user/${userId}/friends/?page=${page}&size=${size}`);
  }

  public addFriend(idUser: number, idFriend: number): Observable<object> {
    const body = {
      friendId: idFriend,
      userId: idUser
    };

    return this.http.post<object>(`${this.url}/user/${idUser}/userFriend/${idFriend}`, body);
  }

  public deleteFriend(idUser: number, idFriend: number): Observable<object> {
    return this.http.delete<object>(`${this.url}user/${idUser}/userFriend/${idFriend}`, this.httpOptions);
  }
}
