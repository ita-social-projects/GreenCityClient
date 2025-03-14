import { Injectable } from '@angular/core';
import { changePasswordLink, setPasswordForGoogleLink, updatePasswordLink } from '../../../main/links';
import { HttpClient } from '@angular/common/http';
import { RestoreDto } from '../../models/restroreDto';
import { Observable } from 'rxjs';
import { UpdatePasswordDto } from 'src/app/shared/models/updatePasswordDto';

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
