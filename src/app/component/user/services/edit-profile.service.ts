import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { EditProfileModel, UserProfilePictureDto } from '@user-models/edit-profile.model';
import { environment } from '@environment/environment';
import { EditProfileDto } from '@user-models/edit-profile.model';

@Injectable({
  providedIn: 'root'
})
export class EditProfileService {
  private url: string = environment.backendLink;
  public files;
  private accessToken: string = localStorage.getItem('accessToken');
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-type': 'multipart/form-data'
    })
  };

  constructor(private http: HttpClient) { }


  public postDataUserProfile(form): Observable<EditProfileModel> {
    const body: EditProfileDto = {
      city: form.value.city,
      firstName: form.value.name,
      userCredo: form.value.title,
      showLocation: form.value.showLocation,
      showEcoPlace: form.value.showEcoPlace,
      showShoppingList: form.value.showShoppingList,
      profilePicturePath: null
    };
    const formData = new FormData();

    if (this.files.length !== 0) {
      body.profilePicturePath = this.files[0].url;
    }

    formData.append('userProfileDtoRequest ', JSON.stringify(body));
    console.log(body)
    return this.http.put<EditProfileModel>(`${this.url}user/profile`, formData);
  }

  public patchUsersPhoto(id: number, img): Observable<UserProfilePictureDto> {
    const imgDto = new UserProfilePictureDto();
    imgDto.id = id;
    imgDto.profilePicturePath = this.files[0].url;

    console.log(imgDto);
    this.httpOptions.headers.set('Authorization', `Bearer ${this.accessToken}`);
    return this.http.patch<UserProfilePictureDto>(`${this.url}user/profilePicture`, imgDto, this.httpOptions);
  }
}
