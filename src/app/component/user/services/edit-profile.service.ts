import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EditProfileModel } from '@user-models/edit-profile.model';
import { environment } from '@environment/environment';
import { FileHandle } from '@eco-news-models/create-news-interface';
import { EditProfileDto } from '@user-models/edit-profile.model';

@Injectable({
  providedIn: 'root'
})
export class EditProfileService {
  private url: string = environment.backendLink;
  public files: FileHandle[] = [];

  constructor(private http: HttpClient) { }


  postDataUserProfile(form): Observable<EditProfileModel> {
    // const body: EditProfileDto = {
    //   city: form.value.city,
    //   firstName: form.value.name,
    //   profilePicturePath: null,
    //   userCredo: form.value.title,
    // };
    // const formData = new FormData();

    // if (this.files.length !== 0) {
    //   body.profilePicturePath = this.files[0].url;
    // }
    // console.log(body);
    // formData.append('userProfileDtoRequest ', JSON.stringify(body));

    return this.http.put<EditProfileModel>(`${this.url}user/profile`, form);
  }

}
