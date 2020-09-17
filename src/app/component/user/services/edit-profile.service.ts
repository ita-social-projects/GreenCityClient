import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EditProfileModel } from '@user-models/edit-profile.model';
import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root'
})
export class EditProfileService {
  private url: string = environment.backendLink;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  public postDataUserProfile(data): Observable<EditProfileModel> {
    return this.http.put<EditProfileModel>(`${this.url}user/profile`, data, this.httpOptions);
  }

  public updateProfilePhoto(data): Observable<object[]> {
    return this.http.patch<object[]>(`${this.url}user/profilePicture`, data);
  }
}
