import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserRoleModel} from '../../model/user/user-role.model';
import {UserStatusModel} from '../../model/user/user-status.model';
import {UserPageableDtoModel} from '../../model/user/user-pageable-dto.model';
import {mainLink, placeLink, userLink} from '../../links';
import {RolesModel} from '../../model/user/roles.model';
import {UserFilterDtoModel} from '../../model/user/userFilterDto.model';
import {UserUpdateModel} from '../../model/user/user-update.model';

const token = localStorage.getItem('accessToken');
let jwtData = null;
let decodedJwtJsonData = null;
let decodedJwtData = null;

@Injectable({
  providedIn: 'root'
})
export class UserService {
  dto: UserStatusModel;
  roleDto: UserRoleModel;
  filterDto: UserFilterDtoModel;
  apiUrl = `${mainLink}user`;

  constructor(private http: HttpClient) {
    if (token != null) {
      jwtData = token.split('.')[1];
      decodedJwtJsonData = window.atob(jwtData);
      decodedJwtData = JSON.parse(decodedJwtJsonData);
    }
  }

  getUserRole(): string {
    if (jwtData != null) {
      return decodedJwtData.roles[0];
    } else {
      return null;
    }
  }

  getUserEmail() {
    return decodedJwtData.sub;
  }

  getAllUsers(paginationSettings: string): Observable<UserPageableDtoModel> {
    return this.http.get<UserPageableDtoModel>(`${this.apiUrl}/all` + paginationSettings);
  }

  updateUserStatus(id: number, userStatus: string) {
    this.dto = new UserStatusModel();
    this.dto.id = id;
    this.dto.userStatus = userStatus;
    return this.http.patch<any>(`${this.apiUrl}/status`, this.dto);
  }

  updateUserRole(id: number, role: string) {
    this.roleDto = new UserRoleModel();
    this.roleDto.id = id;
    this.roleDto.role = role;
    return this.http.patch<any>(`${this.apiUrl}/role`, this.roleDto);
  }

  getRoles(): Observable<RolesModel> {
    return this.http.get<RolesModel>(`${this.apiUrl}/roles`);
  }

  getByFilter(reg: string, paginationSettings: string) {    
    this.filterDto = new UserFilterDtoModel(reg);
    return this.http.post<UserPageableDtoModel>(`${this.apiUrl}/filter` + paginationSettings, this.filterDto);
  }

  getUser() {
    return this.http.get<UserUpdateModel>(`${userLink}`);
  }

  updateUser(userUpdateModel: UserUpdateModel) {
    const body = {
      firstName: userUpdateModel.firstName,
      lastName: userUpdateModel.lastName,
      emailNotification: userUpdateModel.emailNotification
    };
    return this.http.put(`${userLink}`, body);
  }

  getEmailNotificationsStatuses(): Observable<string[]> {
    return this.http.get<string[]>(`${userLink}/emailNotifications`);
  }
}
