import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {mainLink, placeLink} from '../../links';
import {CommentPageableDtoModel} from '../../model/comment/comment-pageable-dto.model';
import {CommentAdminDto} from '../../component/admin/models/comment-admin-dto.model';
import {timeout} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  apiUrl = `${mainLink}`;
  pageSize = 5;
  page = 0;

  constructor(private http: HttpClient) {
  }

  getCurrentPaginationSettings(): string {
    return '?page=' + this.page + '&size=' + this.pageSize  + '&sort=createdDate,desc';
  }

  getCommentsByPage(): Observable<CommentPageableDtoModel> {
    return this.http.get<CommentPageableDtoModel>(`${this.apiUrl}comments`
      + this.getCurrentPaginationSettings());
  }

  changePage(page: number) {
    this.page = page;
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}comments?id=` + id);
  }
}
