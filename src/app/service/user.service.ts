import {Injectable} from '@angular/core';
import {BaseService} from './base.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserForListDtoModel} from '../model/UserForListDto.model';
import {PageableDtoModel} from '../model/PageableDto.model';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {
  constructor(protected http: HttpClient) {
    super(http);
    this.apiUrl += '/user';
  }

  getAllUsers(paginationSettings: string): Observable<PageableDtoModel> {
    return this.http.get<PageableDtoModel>(`${this.apiUrl}` + paginationSettings);
  }

  updateUserStatus(id: number, userStatus: string) {
    return this.http.post<any>(`${this.apiUrl}/update/status?id=${id}&status=${userStatus}`, {});
  }
}
