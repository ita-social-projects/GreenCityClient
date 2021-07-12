import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EditProfileModel } from '@user-models/edit-profile.model';
import { mainUserLink } from '../../../links';

@Injectable({
  providedIn: 'root'
})
export class EditProfileService {
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  public postDataUserProfile(data): Observable<EditProfileModel> {
    return this.http.put<EditProfileModel>(`${mainUserLink}user/profile`, data, { ...this.httpOptions, responseType: 'text' as 'json' });
  }

  public updateProfilePhoto(data): Observable<object[]> {
    return this.http.patch<object[]>(`${mainUserLink}user/profilePicture`, data);
  }

  public deleProfilePhoto(): Observable<object> {
    return this.http.patch<object>(`${mainUserLink}user/deleteProfilePicture`, this.httpOptions);
  }
}
