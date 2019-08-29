import {Injectable} from '@angular/core';
import {BaseService} from './base.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserForListDtoModel} from '../model/UserForListDto.model';
import {PageableDtoModel} from '../model/PageableDto.model';
import {UserPageableDtoModel} from '../model/UserPageableDto.model';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {
  constructor(protected http: HttpClient) {
    super(http);
    this.apiUrl += '/user';
  }

  getAllUsers(paginationSettings: string): Observable<UserPageableDtoModel> {
    return this.http.get<UserPageableDtoModel>(`${this.apiUrl}` + paginationSettings);
  }

  updateUserStatus(id: number, userStatus: string) {
    return this.http.patch<any>(`${this.apiUrl}/update/status?id=${id}&status=${userStatus}`, {});
  }

  updateUserRole(id: number, role: string) {
    console.log(role);
    return this.http.patch<any>(`${this.apiUrl}/update/role?id=${id}&role=${role}`, {});
  }
}
