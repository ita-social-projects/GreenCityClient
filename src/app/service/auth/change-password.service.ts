import { Injectable } from '@angular/core';
import { changePasswordLink } from '../../links';
import { HttpClient } from '@angular/common/http';
import { RestoreDto } from '../../model/restroreDto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChangePasswordService {
  constructor(private http: HttpClient) {}

  public restorePassword(dto: RestoreDto): Observable<object> {
    return this.http.post<object>(changePasswordLink, dto);
  }
}
