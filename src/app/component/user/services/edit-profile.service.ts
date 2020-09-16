import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EditProfileModel } from '@user-models/edit-profile.model';
import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root'
})
export class EditProfileService {
  private url: string = environment.backendLink;

  constructor(private http: HttpClient) { }


  public postDataUserProfile(data): Observable<EditProfileModel> {
    return this.http.put<EditProfileModel>(`${this.url}user/profile`, data);
  }

  public updateProfilePhoto(data): Observable<object[]> {
    return this.http.patch<object[]>(`${this.url}user/profilePicture`, data);
  }
}
