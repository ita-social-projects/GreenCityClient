import { LocalStorageService } from '../localstorage/local-storage.service';
import { catchError } from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {UserRoleModel} from '../../model/user/user-role.model';
import {UserStatusModel} from '../../model/user/user-status.model';
import {UserPageableDtoModel} from '../../model/user/user-pageable-dto.model';
import {mainLink, userLink} from '../../links';
import {RolesModel} from '../../model/user/roles.model';
import {UserFilterDtoModel} from '../../model/user/userFilterDto.model';
import {UserUpdateModel} from '../../model/user/user-update.model';
import {Goal} from '../../model/goal/Goal';
import {GoalType} from '../../component/user/user-goals/add-goal/add-goal-list/GoalType';
import {CustomGoalResponseDto} from '../../model/goal/CustomGoalResponseDto';
import {CustomGoalSaveRequestDto} from '../../model/goal/CustomGoalSaveRequestDto';
import {UserCustomGoalDto} from '../../model/goal/UserCustomGoalDto';
import {UserGoalDto} from '../../model/goal/UserGoalDto';

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
  private availableCustomGoalsSubject = new BehaviorSubject<Goal[]>([]);
  private availablePredefinedGoalsSubject = new BehaviorSubject<Goal[]>([]);

  private dataStore: { goals: Goal[], availableCustomGoals: Goal[], availablePredefinedGoals } =
    {goals: [], availableCustomGoals: [], availablePredefinedGoals: []};

  readonly goals = this.goalsSubject.asObservable();
  readonly availableCustomGoals = this.availableCustomGoalsSubject.asObservable();
  readonly availablePredefinedGoals = this.availablePredefinedGoalsSubject.asObservable();

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
    const http$ = this.http.get<Goal[]>(`${this.apiUrl}/${this.userId}/goals`);
    http$.pipe(
      catchError(() => of([]))
    ).subscribe(
      data => {
        this.dataStore.goals = data;
        this.dataStore.goals.forEach(goal => goal.type = GoalType.TRACKED);
        this.goalsSubject.next(Object.assign({}, this.dataStore).goals);
      },
      error => { throw error; }
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
    this.http.get<Goal[]>(`${userLink}/${this.userId}/customGoals/available`).subscribe(data => {
      data.forEach(goal => {
        goal.type = GoalType.CUSTOM;
        goal.status = 'UNCHECKED';
      });

      this.dataStore.availableCustomGoals = data;
      this.availableCustomGoalsSubject.next(Object.assign({}, this.dataStore).availableCustomGoals);
    });
  }

  loadAvailablePredefinedGoals() {
    const goals = [];
    this.http.get<Goal[]>(`${userLink}/${this.userId}/goals/available`).subscribe(data => {
      data.forEach(goal => {
        goals.push({id: goal.id, text: goal.text, status: 'UNCHECKED', type: GoalType.PREDEFINED});
      });
      this.dataStore.availablePredefinedGoals = goals;
      this.availablePredefinedGoalsSubject.next(Object.assign({}, this.dataStore).availablePredefinedGoals);
    });
  }

  saveCustomGoals(goals: Goal[]) {
    const dto = {
      customGoalSaveRequestDtoList: goals.map<CustomGoalSaveRequestDto>(data => {
        return {text: data.text};
      })
    };

    this.http.post<Goal[]>(`${userLink}/${this.userId}/customGoals`, dto).subscribe(() => {
    });
  }

  deleteCustomGoals(goals: Goal[]) {
    this.http.delete(`${userLink}/${this.userId}/customGoals?ids=` + goals.map(goal => goal.id)).subscribe();
  }

  updateCustomGoals(goals: Goal[]) {
    const dto = {
      customGoals: goals.map<CustomGoalResponseDto>(data => {
        return {id: data.id, text: data.text};
      })
    };

    this.http.patch<Goal[]>(`${userLink}/${this.userId}/customGoals`, dto).subscribe(data => {
      data.forEach(updatedGoal => {
        this.dataStore.availableCustomGoals.forEach(currentGoal => {
          if (currentGoal.id === updatedGoal.id && currentGoal.type === GoalType.CUSTOM) {
            currentGoal.text = updatedGoal.text;
          }
        });
      });
    });
  }

  deleteTrackedGoals(goals: Goal[]) {
    this.http.delete(`${userLink}/${this.userId}/userGoals?ids=` + goals.map(goal => goal.id)).subscribe(() => {
      this.dataStore.goals = this.dataStore.goals.filter(data => goals.filter(g => g.id === data.id).length === 0);
      this.goalsSubject.next(Object.assign({}, this.dataStore).goals);
    });
  }

  addPredefinedAndCustomGoals(predefinedGoals: Goal[], customGoals: Goal[]) {
    const dto = {
      userGoals: predefinedGoals.map<UserGoalDto>(data => {
        return {goal: {id: data.id}};
      }),
      userCustomGoal: customGoals.map<UserCustomGoalDto>(data => {
        return {customGoal: {id: data.id}};
      })
    };

    this.http.post<Goal[]>(`${userLink}/${this.userId}/goals`, dto).subscribe(data => {
      this.dataStore.goals = data;
      this.goalsSubject.next(Object.assign({}, this.dataStore).goals);
    });
  }
}
