import { Injectable } from '@angular/core';
import { changePasswordLink, setPasswordForGoogleLink, updatePasswordLink } from '../../links';
import { HttpClient } from '@angular/common/http';
import { RestoreDto } from '../../model/restroreDto';
import { Observable } from 'rxjs';
import { UpdatePasswordDto } from '@global-models/updatePasswordDto';

@Injectable({ providedIn: 'root' })
export class ChangePasswordService {
  constructor(private http: HttpClient) {}

  restorePassword(dto: RestoreDto): Observable<object> {
    return this.http.post<object>(updatePasswordLink, dto);
  }

  changePassword(updatePasswordDto: UpdatePasswordDto): Observable<object> {
    return this.http.put<UpdatePasswordDto>(changePasswordLink, updatePasswordDto);
  }

  setPasswordForGoogleAuth(updatePasswordDto: UpdatePasswordDto): Observable<object> {
    return this.http.post<object>(setPasswordForGoogleLink, updatePasswordDto);
  }
}
