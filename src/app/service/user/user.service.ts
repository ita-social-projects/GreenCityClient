import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {mailLink} from '../../links';
import {UserRoleModel} from '../../model/user/user-role.model';
import {UserStatusModel} from '../../model/user/user-status.model';
import {UserPageableDtoModel} from '../../model/user/user-pageable-dto.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('accessToken')
  })
};

const jwtData = localStorage.getItem('accessToken').split('.')[1];
const decodedJwtJsonData = window.atob(jwtData);
const decodedJwtData = JSON.parse(decodedJwtJsonData);

@Injectable({
  providedIn: 'root'
})
export class UserService {
  dto: UserStatusModel;
  roleDto: UserRoleModel;
  apiUrl = 'http://localhost:8080/user';

  constructor(private http: HttpClient) {
  }

  getUserRole(): string {
    return  decodedJwtData.roles[0];
  }

  getAllUsers(paginationSettings: string): Observable<UserPageableDtoModel> {
    console.log(httpOptions);
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
