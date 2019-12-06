import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserRoleModel } from '../../model/user/user-role.model';
import { UserStatusModel } from '../../model/user/user-status.model';
import { UserPageableDtoModel } from '../../model/user/user-pageable-dto.model';
import { mainLink, userLink } from '../../links';
import { RolesModel } from '../../model/user/roles.model';
import { UserFilterDtoModel } from '../../model/user/userFilterDto.model';
import { UserUpdateModel } from '../../model/user/user-update.model';
import { Goal } from '../../model/goal/Goal';
import {LocalStorageService} from '../localstorage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  dto: UserStatusModel;
  roleDto: UserRoleModel;
  filterDto: UserFilterDtoModel;
  apiUrl = `${mainLink}user`;
  userId: number;

  private goalsSubject = new BehaviorSubject<Goal[]>([]);
  private dataStore: { goals: Goal[] } = { goals: [] };

  readonly goals = this.goalsSubject.asObservable();

  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {
    localStorageService.userIdBehaviourSubject.subscribe(userId => this.userId = userId);
  }

  getAllUsers(paginationSettings: string): Observable<UserPageableDtoModel> {
    return this.http.get<UserPageableDtoModel>(
      `${this.apiUrl}/all` + paginationSettings
    );
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
    return this.http.post<UserPageableDtoModel>(
      `${this.apiUrl}/filter` + paginationSettings,
      this.filterDto
    );
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

  loadAllGoals() {
    this.http.get<Goal[]>(`${this.apiUrl}/${this.userId}/goals`).subscribe(
      data => {
        this.dataStore.goals = data;
        this.goalsSubject.next(Object.assign({}, this.dataStore).goals);
      },
      error => {
        throw error;
      }
    );
  }

  updateGoalStatus(goal: Goal) {
    this.http.patch<Goal>(`${this.apiUrl}/${this.userId}/goals/${goal.id}`, goal).subscribe(
      data => {
        this.dataStore.goals = [
          ...this.dataStore.goals.filter(el => el.id !== goal.id),
          data
        ];
        this.goalsSubject.next(Object.assign({}, this.dataStore).goals);
      },
      error => {
        throw error;
      }
    );
  }
}
