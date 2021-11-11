import { Injectable } from '@angular/core';
import { changePasswordLink, updatePasswordLink } from '../../links';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RestoreDto } from '../../model/restroreDto';
import { Observable } from 'rxjs';
import { UpdatePasswordDto } from '@global-models/updatePasswordDto';

@Injectable({ providedIn: 'root' })
export class ChangePasswordService {
  constructor(private http: HttpClient) {}

  private accessToken: string = localStorage.getItem('accessToken');

  public restorePassword(dto: RestoreDto): Observable<object> {
    return this.http.post<object>(updatePasswordLink, dto);
  }

  public changePassword(updatePasswordDto: UpdatePasswordDto): Observable<object> {
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`
    });
    return this.http.put<object>(changePasswordLink, updatePasswordDto, { headers: myHeaders });
  }
}
