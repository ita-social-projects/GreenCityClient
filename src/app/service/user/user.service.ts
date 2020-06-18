import { LocalStorageService } from '../localstorage/local-storage.service';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { UserRoleModel } from '../../model/user/user-role.model';
import { UserStatusModel } from '../../model/user/user-status.model';
import { UserPageableDtoModel } from '../../model/user/user-pageable-dto.model';
import { habitStatisticLink, mainLink, userLink } from '../../links';
import { RolesModel } from '../../model/user/roles.model';
import { UserFilterDtoModel } from '../../model/user/userFilterDto.model';
import { UserUpdateModel } from '../../model/user/user-update.model';
import { Goal } from '../../model/goal/Goal';
import { GoalType } from '../../component/user/components/user-goals/add-goal/add-goal-list/GoalType';
import { CustomGoalResponseDto } from '../../model/goal/CustomGoalResponseDto';
import { CustomGoalSaveRequestDto } from '../../model/goal/CustomGoalSaveRequestDto';
import { UserCustomGoalDto } from '../../model/goal/UserCustomGoalDto';
import { UserGoalDto } from '../../model/goal/UserGoalDto';
import { OnLogout } from '../OnLogout';
import { HabitItemsAmountStatisticDto } from '../../model/goal/HabitItemsAmountStatisticDto';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnLogout {
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

  loadAllGoals(language: string) {
    const http$ = this.http.get<Goal[]>(`${this.apiUrl}/${this.userId}/goals?language=${language}`);
    http$.pipe(
      catchError(() => of([]))
    ).subscribe(
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

  updateGoalStatus(goal: Goal, language: string) {
    this.http.patch<Goal>(`${this.apiUrl}/${this.userId}/goals/${goal.id}?language=${language}`, goal).subscribe(
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
    }, error => {
      throw error;
    });
  }

  loadAvailablePredefinedGoals(language: string) {
    const goals = [];
    this.http.get<Goal[]>(`${userLink}/${this.userId}/goals/available?language=${language}`)
      .pipe(catchError(err => of([])))
      .subscribe(data => {
        data.forEach(goal => {
          goals.push({id: goal.id, text: goal.text, status: 'UNCHECKED', type: GoalType.PREDEFINED});
        });
        this.dataStore.availablePredefinedGoals = goals;
        this.availablePredefinedGoalsSubject.next(Object.assign({}, this.dataStore).availablePredefinedGoals);
      }, error => {
        throw error;
      });
  }

  saveCustomGoals(goals: Goal[], language: string) {
    const dto = {
      customGoalSaveRequestDtoList: goals.map<CustomGoalSaveRequestDto>(data => {
        return {text: data.text};
      })
    };

    this.http.post<Goal[]>(`${userLink}/${this.userId}/customGoals?language=${language}`, dto).subscribe(data => {
      if (goals.filter(goal => goals.filter(g => g.status === 'CHECKED' && g.text === goal.text).length !== 0).length !== 0) {
        this.addPredefinedAndCustomGoals([],
          data.filter(goal => goals.filter(g => g.status === 'CHECKED' && g.text === goal.text).length !== 0), language);
      }
    }, error => {
      throw error;
    });
  }

  deleteCustomGoals(goals: Goal[]) {
    this.http.delete(`${userLink}/${this.userId}/customGoals?ids=` + goals.map(goal => goal.id)).subscribe(() => {
    }, error => {
      throw error;
    });
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
    }, error => {
      throw error;
    });
  }

  deleteTrackedGoals(goals: Goal[]) {
    this.http.delete(`${userLink}/${this.userId}/userGoals?ids=` + goals.map(goal => goal.id)).subscribe(() => {
      this.dataStore.goals = this.dataStore.goals.filter(data => goals.filter(g => g.id === data.id).length === 0);
      this.goalsSubject.next(Object.assign({}, this.dataStore).goals);
    }, error => {
      throw error;
    });
  }

  addPredefinedAndCustomGoals(predefinedGoals: Goal[], customGoals: Goal[], language: string) {
    const dto = {
      userGoals: predefinedGoals.map<UserGoalDto>(data => {
        return {goal: {id: data.id}};
      }),
      userCustomGoal: customGoals.map<UserCustomGoalDto>(data => {
        return {customGoal: {id: data.id}};
      })
    };

    this.http.post<Goal[]>(`${userLink}/${this.userId}/goals?language=${language}`, dto).subscribe(data => {
      this.dataStore.goals = data;
      this.goalsSubject.next(Object.assign({}, this.dataStore).goals);
    }, error => {
      throw error;
    });
  }

  onLogout(): void {
    this.dataStore.goals = [];
    this.dataStore.availableCustomGoals = [];
    this.dataStore.availablePredefinedGoals = [];
    this.goalsSubject.next(Object.assign({}, this.dataStore).goals);
    this.availableCustomGoalsSubject.next(Object.assign({}, this.dataStore).availableCustomGoals);
    this.availablePredefinedGoalsSubject.next(Object.assign({}, this.dataStore).availablePredefinedGoals);
  }

  /**
   * Returns amount of users with activated status.
   * Can be used for representing total amount of users in the system.
   *
   * @returns Observable<number> that can be used for subscription to obtain amount of users.
   */
  countActivatedUsers(): Observable<number> {
    return this.http.get(`${userLink}/activatedUsersAmount`) as Observable<number>;
  }

  /**
   * Returns statistic for all not taken habit items in the system for today.
   * Data is returned as an array of key-value-pairs mapped to HabitItemsAmountStatisticDto,
   * where key is the name of habit item and value is not taken amount of these items.
   * Language of habit items is defined by the `language` parameter.
   * By default English language is set on the backend and should be used for technical purposes.
   * When habit items have to be represented to users this parameter should be set according to user's localization.
   *
   * @param language - Optional parameter for name of habit item localization language(e.x. "en" or "uk").
   * @returns Observable<Array<HabitItemsAmountStatisticDto>> that can be used for those key-value pairs acquisition.
   */
  getTodayStatisticsForAllHabitItems(language?: string): Observable<Array<HabitItemsAmountStatisticDto>> {
    let endpointLink = `${habitStatisticLink}todayStatisticsForAllHabitItems`;
    if (language !== undefined) {
      endpointLink += `?language=${language}`;
    }
    return this.http.get(endpointLink) as Observable<Array<HabitItemsAmountStatisticDto>>;
  }
}
