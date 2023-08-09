import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { EditProfileModel } from '@global-user/models/edit-profile.model';
import { FriendArrayModel, FriendModel, SixFriendArrayModel } from '@global-user/models/friend.model';
import { ProfileStatistics } from '@global-user/models/profile-statistiscs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserFriendsService {
  addedFriends: FriendModel[] = [];
  private size = 10;
  public url: string = environment.backendUserLink;
  public urlFriend: string = environment.backendLink;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  public getUserInfo(id: number): Observable<EditProfileModel> {
    return this.http.get<EditProfileModel>(`${this.url}user/${id}/profile/`);
  }

  public getUserProfileStatistics(id: number) {
    return this.http.get<ProfileStatistics>(`${this.url}user/${id}/profileStatistics/`);
  }

  public isOnline(id: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.url}user/isOnline/${id}/`);
  }

  public getRequests(page = 0, size = this.size): Observable<FriendArrayModel> {
    return this.http.get<FriendArrayModel>(`${this.urlFriend}friends/friendRequests?page=${page}&size=${size}`);
  }

  public getSixFriends(userId: number): Observable<SixFriendArrayModel> {
    return this.http.get<SixFriendArrayModel>(`${this.url}user/${userId}/sixUserFriends/`);
  }

  public getAllFriends(page = 0, size = this.size): Observable<FriendArrayModel> {
    return this.http.get<FriendArrayModel>(`${this.urlFriend}friends?page=${page}&size=${size}`);
  }

  public getNewFriends(page = 0, size = this.size, name = ''): Observable<FriendArrayModel> {
    return this.http.get<FriendArrayModel>(`${this.urlFriend}friends/not-friends-yet?name=${name}&page=${page}&size=${size}`);
  }

  public getAllFriendsAndByName(name = '', page = 0, size = this.size): Observable<FriendArrayModel> {
    return this.http.get<FriendArrayModel>(`${this.urlFriend}friends?name=${name}&page=${page}&size=${size}`);
  }

  public addFriend(idFriend: number): Observable<object> {
    return this.http.post<object>(`${this.urlFriend}friends/${idFriend}`, {});
  }

  public acceptRequest(idFriend: number): Observable<object> {
    return this.http.patch<object>(`${this.urlFriend}friends/${idFriend}/acceptFriend`, {});
  }

  public declineRequest(idFriend: number): Observable<object> {
    return this.http.delete<object>(`${this.urlFriend}friends/${idFriend}/declineFriend`, {});
  }

  public deleteFriend(idFriend: number): Observable<object> {
    return this.http.delete<object>(`${this.urlFriend}friends/${idFriend}`, this.httpOptions);
  }

  addedFriendsToHabit(friend) {
    this.addedFriends.push(friend);
  }
}
