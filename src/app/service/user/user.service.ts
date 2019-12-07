import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {UserRoleModel} from '../../model/user/user-role.model';
import {UserStatusModel} from '../../model/user/user-status.model';
import {UserPageableDtoModel} from '../../model/user/user-pageable-dto.model';
import {mainLink, userLink} from '../../links';
import {RolesModel} from '../../model/user/roles.model';
import {UserFilterDtoModel} from '../../model/user/userFilterDto.model';
import {UserUpdateModel} from '../../model/user/user-update.model';
import {Goal} from '../../model/goal/Goal';
import {GoalType} from '../../component/user/user-goals/add-goal/add-goal-list/GoalType';

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
  private availableCustomGoalsSubject = new BehaviorSubject<Goal[]>([]);
  private availablePredefinedGoalsSubject = new BehaviorSubject<Goal[]>([]);

  private dataStore: { goals: Goal[], availableCustomGoals: Goal[], availablePredefinedGoals } =
    {goals: [], availableCustomGoals: [], availablePredefinedGoals: []};

  readonly goals = this.goalsSubject.asObservable();
  readonly availableCustomGoals = this.availableCustomGoalsSubject.asObservable();
  readonly availablePredefinedGoals = this.availablePredefinedGoalsSubject.asObservable();

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
        this.dataStore.goals.forEach(goal => goal.type = GoalType.TRACKED);
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

  loadAvailableCustomGoals() {
    this.dataStore.availableCustomGoals = [{id: 1, text: 'Custom Goal 1', status: null, type: null},
      {id: 2, text: 'Custom Goal 2', status: null, type: null}];

    this.dataStore.availableCustomGoals.forEach(goal => {
      goal.type = GoalType.CUSTOM;
      goal.status = 'UNCHECKED';
    });

    this.availableCustomGoalsSubject.next(Object.assign({}, this.dataStore).availableCustomGoals);
  }

  loadAvailablePredefinedGoals() {
    this.dataStore.availablePredefinedGoals = [{id: 1, text: 'Predefined Goal 1', status: null, type: null},
      {id: 2, text: 'Predefined Goal 2', status: null, type: null}];

    this.dataStore.availablePredefinedGoals.forEach(goal => {
      goal.type = GoalType.PREDEFINED;
      goal.status = 'UNCHECKED';
    });

    this.availablePredefinedGoalsSubject.next(Object.assign({}, this.dataStore).availablePredefinedGoals);
  }

  saveCustomGoals(goals: Goal[]) {
    console.log('Save custom goals:');
    console.log(goals);
  }

  deleteCustomGoals(goals: Goal[]) {
    console.log('Delete custom goals:');
    console.log(goals);
  }

  updateCustomGoals(goals: Goal[]) {
    console.log('Update custom goals:');
    console.log(goals);
  }

  deleteTrackedGoals(goals: Goal[]) {
    console.log('Delete tracked goals:');
    console.log(goals);
  }

  addPredefinedGoals(goals: Goal[]) {
    console.log('Add predefined goals');
    console.log(goals);
  }
}
