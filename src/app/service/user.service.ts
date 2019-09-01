import {Injectable} from '@angular/core';
import {BaseService} from './base.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserForListDtoModel} from '../model/UserForListDto.model';
import {PageableDtoModel} from '../model/PageableDto.model';
import {UserPageableDtoModel} from '../model/UserPageableDto.model';
import {UserStatusModel} from '../model/UserStatus.model';
import {UserRoleModel} from '../model/UserRole.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-type': 'application/json',
    Authorization: 'klmlk'
  })
};

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {
  constructor(protected http: HttpClient) {
    super(http);
    this.apiUrl += '/user';
  }

  dto: UserStatusModel;
  roleDto: UserRoleModel;

  getAllUsers(paginationSettings: string): Observable<UserPageableDtoModel> {
    return this.http.get<UserPageableDtoModel>(`${this.apiUrl}` + paginationSettings, httpOptions);
  }

  updateUserStatus(id: number, userStatus: string) {
    this.dto = new UserStatusModel();
    this.dto.id = id;
    this.dto.userStatus = userStatus;
    return this.http.patch<any>(`${this.apiUrl}/update/status`, this.dto);
  }

  updateUserRole(id: number, role: string) {
    this.roleDto = new UserRoleModel();
    this.roleDto.id = id;
    this.roleDto.role = role;
    return this.http.patch<any>(`${this.apiUrl}/update/role`, this.roleDto);
  }
}
