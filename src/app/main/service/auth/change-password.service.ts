import { Injectable } from '@angular/core';
import { updatePasswordLink } from '../../links';
import { HttpClient } from '@angular/common/http';
import { RestoreDto } from '../../model/restroreDto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChangePasswordService {
  constructor(private http: HttpClient) {}

  public restorePassword(dto: RestoreDto): Observable<object> {
    return this.http.post<object>(updatePasswordLink, dto);
  }
}
