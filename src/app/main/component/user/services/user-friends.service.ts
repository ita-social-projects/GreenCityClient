import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { FriendArrayModel, FriendModel, SixFriendArrayModel } from '@global-user/models/friend.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserFriendsService {
  addedFriends: FriendModel[] = [];
  private size = 10;
  public url: string = environment.backendUserLink;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  public getRecommendedFriends(id: number, page = 0, size = this.size): Observable<FriendArrayModel> {
    return this.http.get<FriendArrayModel>(`${this.url}user/${id}/recommendedFriends/?page=${page}&size=${size}`);
  }

  public getRequests(id: number, page = 0, size = this.size): Observable<FriendArrayModel> {
    return this.http.get<FriendArrayModel>(`${this.url}user/${id}/friendRequests/?page=${page}&size=${size}`);
  }

  public getSixFriends(userId: number): Observable<SixFriendArrayModel> {
    return this.http.get<SixFriendArrayModel>(`${this.url}user/${userId}/sixUserFriends/`);
  }

  public getAllFriends(userId: number, page = 0, size = this.size): Observable<FriendArrayModel> {
    return this.http.get<FriendArrayModel>(`${this.url}user/${userId}/findAll/friends/?page=${page}&size=${size}`);
  }

  public getRecommendedNewFriends(userId: number, page = 0, size = this.size): Observable<FriendArrayModel> {
    return this.http.get<FriendArrayModel>(`${this.url}user/${userId}/findAll/friendsWithoutExist/?page=${page}&size=${size}`);
  }

  public findNewFriendsByName(name: string, page = 0, size = this.size): Observable<FriendArrayModel> {
    return this.http.get<FriendArrayModel>(`${this.url}user/findNewFriendsByName/?name=${name}&page=${page}&size=${size}`);
  }

  public findFriendByName(name: string, page = 0, size = this.size): Observable<FriendArrayModel> {
    return this.http.get<FriendArrayModel>(`${this.url}user/findFriendByName/?name=${name}&page=${page}&size=${size}`);
  }

  public addFriend(idUser: number, idFriend: number): Observable<object> {
    const body = {
      friendId: idFriend,
      userId: idUser
    };

    return this.http.post<object>(`${this.url}/user/${idUser}/userFriend/${idFriend}`, body);
  }

  public acceptRequest(idUser: number, idFriend: number): Observable<object> {
    const body = {
      friendId: idFriend,
      userId: idUser
    };

    return this.http.post<object>(`${this.url}/user/${idUser}/acceptFriend/${idFriend}`, body);
  }

  public declineRequest(idUser: number, idFriend: number): Observable<object> {
    const body = {
      friendId: idFriend,
      userId: idUser
    };

    return this.http.post<object>(`${this.url}/user/${idUser}/declineFriend/${idFriend}`, body);
  }

  public deleteFriend(idUser: number, idFriend: number): Observable<object> {
    return this.http.delete<object>(`${this.url}user/${idUser}/userFriend/${idFriend}`, this.httpOptions);
  }

  addedFriendsToHabit(friend) {
    this.addedFriends.push(friend);
  }
}
