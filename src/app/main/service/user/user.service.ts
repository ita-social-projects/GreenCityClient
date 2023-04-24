import { LocalStorageService } from '../localstorage/local-storage.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserRoleModel } from '../../model/user/user-role.model';
import { UserStatusModel } from '../../model/user/user-status.model';
import { UserPageableDtoModel } from '../../model/user/user-pageable-dto.model';
import { habitStatisticLink, userLink } from '../../links';
import { RolesModel } from '../../model/user/roles.model';
import { UserFilterDtoModel } from '../../model/user/userFilterDto.model';
import { UserUpdateModel } from '../../model/user/user-update.model';
import * as moment from 'moment';
import { HabitItemsAmountStatisticDto } from '@global-models/goal/HabitItemsAmountStatisticDto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  dto: UserStatusModel;
  roleDto: UserRoleModel;
  filterDto: UserFilterDtoModel;
  userId: number;

  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {
    localStorageService.userIdBehaviourSubject.subscribe((userId) => (this.userId = userId));
  }

  getAllUsers(paginationSettings: string): Observable<UserPageableDtoModel> {
    return this.http.get<UserPageableDtoModel>(`${userLink}/all` + paginationSettings);
  }

  updateUserStatus(id: number, userStatus: string) {
    this.dto = new UserStatusModel();
    this.dto.id = id;
    this.dto.userStatus = userStatus;
    return this.http.patch<any>(`${userLink}/status`, this.dto);
  }

  updateUserRole(id: number, role: string) {
    this.roleDto = new UserRoleModel();
    this.roleDto.id = id;
    this.roleDto.role = role;
    return this.http.patch<any>(`${userLink}/role`, this.roleDto);
  }

  getRoles(): Observable<RolesModel> {
    return this.http.get<RolesModel>(`${userLink}/roles`);
  }

  getByFilter(reg: string, paginationSettings: string) {
    this.filterDto = new UserFilterDtoModel(reg);
    return this.http.post<UserPageableDtoModel>(`${userLink}/filter` + paginationSettings, this.filterDto);
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

  updateLastTimeActivity() {
    const date = new Date();
    this.convertDate(date);
    return this.http.put(`${userLink}/updateUserLastActivityTime/`, this.convertDate(date));
  }

  convertDate = (date) => moment(date).format('yyyy-MM-DDTHH:mm:ss.SSSSSS');

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

  updateUserLanguage(languageId: number) {
    const body = {};
    return this.http.put(`${userLink}/language/${languageId}`, body);
  }
}
