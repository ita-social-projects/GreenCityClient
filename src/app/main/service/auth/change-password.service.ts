import { Injectable } from '@angular/core';
import { changePasswordLink, updatePasswordLink } from '../../links';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RestoreDto } from '../../model/restroreDto';
import { Observable } from 'rxjs';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { UpdatePasswordDto } from '@global-models/updatePasswordDto';

@Injectable({ providedIn: 'root' })
export class ChangePasswordService {
  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {}

  private accessToken: string = localStorage.getItem('accessToken');

  private httpOptions = {
    headers: new HttpHeaders({
      Authorization: 'my-auth-token'
    })
  };

  public restorePassword(dto: RestoreDto): Observable<object> {
    return this.http.post<object>(updatePasswordLink, dto);
  }

  public changePassword(updatePasswordDto: UpdatePasswordDto): Observable<object> {
    this.httpOptions.headers.set('Authorization', `Bearer ${this.accessToken}`);
    return this.http.post<object>(changePasswordLink, updatePasswordDto, this.httpOptions);
  }
}
