import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {UserRoleModel} from '../../model/user/user-role.model';
import {UserStatusModel} from '../../model/user/user-status.model';
import {UserPageableDtoModel} from '../../model/user/user-pageable-dto.model';
import {mainLink, userLink} from '../../links';
import {RolesModel} from '../../model/user/roles.model';
import {UserFilterDtoModel} from '../../model/user/userFilterDto.model';
import {UserUpdateModel} from '../../model/user/user-update.model';
import {Goal} from '../../model/goal/Goal';

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
  userId = window.localStorage.getItem('userId');

  private goalsSubject = new BehaviorSubject<Goal[]>([]);
  private availableGoalsSubject = new BehaviorSubject<Goal[]>([]);
  private dataStore: { goals: Goal[], availableGoals: Goal[] } = {goals: [], availableGoals: []};

  readonly goals = this.goalsSubject.asObservable();
  readonly availableGoals = this.availableGoalsSubject.asObservable();

  constructor(private http: HttpClient) {
    if (token != null) {
      jwtData = token.split('.')[1];
      decodedJwtJsonData = window.atob(jwtData);
      decodedJwtData = JSON.parse(decodedJwtJsonData);
    }
  }

  getUserRole(): string {
    if (jwtData != null) {
      return decodedJwtData.authorities[0];
    } else {
      return null;
    }
  }

  getUserEmail() {
    return decodedJwtData.sub;
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

  loadAvailableGoals() {
    this.dataStore.availableGoals = [{id: 1, text: 'goal 1', status: 'UNCHECKED', isCustom: true},
      {id: 2, text: 'goal 2', status: 'UNCHECKED', isCustom: false}];
    this.availableGoalsSubject.next(Object.assign({}, this.dataStore).availableGoals);
  }

  addGoals(goals: Goal[]) {
    console.log(goals);
  }

  addCustomGoal(goal: Goal) {
    this.dataStore.availableGoals.push(goal);
    this.availableGoalsSubject.next(Object.assign({}, this.dataStore).availableGoals);
  }

  deleteCustomGoal(goal: Goal) {
    this.dataStore.availableGoals = this.dataStore.availableGoals.filter(g => g.id !== goal.id);
    this.availableGoalsSubject.next(Object.assign({}, this.dataStore).availableGoals);
  }

  changeCustomGoal(goal: Goal) {
    this.dataStore.availableGoals.forEach((data, index) => {
      if (data.id === goal.id) {
        this.dataStore.availableGoals[index] = goal;
        this.availableGoalsSubject.next(Object.assign({}, this.dataStore).availableGoals);
        return;
      }
    });
  }
}
