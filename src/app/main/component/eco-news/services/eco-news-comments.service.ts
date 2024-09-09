import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@environment/environment';
import { CommentsService } from '../../comments/services/comments.service';
import { AddedCommentDTO, CommentsModel } from '../../comments/models/comments-model';
import { EcoNewsAddedCommentDTO, EcoNewsCommentsModel } from '../models/econ-news-comments.model';

@Injectable({
  providedIn: 'root'
})
export class EcoNewsCommentsService implements CommentsService {
  private backEnd = environment.backendLink;

  constructor(private http: HttpClient) {}

  addComment(entityId: number, text: string, id = 0): Observable<AddedCommentDTO> {
    const body = {
      parentCommentId: id,
      text
    };

    return this.http.post<EcoNewsAddedCommentDTO>(`${this.backEnd}eco-news/${entityId}/comments`, body);
  }

  getActiveCommentsByPage(entityId: number, page: number, size: number): Observable<CommentsModel> {
    return this.http.get<EcoNewsCommentsModel>(
      `${this.backEnd}eco-news/${entityId}/comments?statuses=ORIGINAL,EDITED&page=${page}&size=${size}`
    );
  }

  getCommentsCount(entityId: number): Observable<number> {
    return this.http.get<number>(`${this.backEnd}eco-news/${entityId}/comments/count`);
  }

  getActiveRepliesByPage(entityId: number, id: number, page: number, size: number): Observable<CommentsModel> {
    return this.http.get<EcoNewsCommentsModel>(
      `${this.backEnd}eco-news/${entityId}/comments/${id}/replies?statuses=ORIGINAL,EDITED&page=${page}&size=${size}`
    );
  }

  deleteComments(entityId: number, id: number) {
    return this.http
      .delete<object>(`${this.backEnd}eco-news/${entityId}/comments/${id}`, { observe: 'response' })
      .pipe(map((response) => response.status >= 200 && response.status < 300));
  }

  getCommentLikes(entityId: number, id: number): Observable<number> {
    return this.http.get<number>(`${this.backEnd}eco-news/${entityId}/comments/${id}/likes/count`);
  }

  getRepliesAmount(entityId: number, id: number): Observable<number> {
    return this.http.get<number>(`${this.backEnd}eco-news/${entityId}/comments/${id}/replies/count`);
  }

  postLike(entityId: number, id: number): Observable<void> {
    return this.http.post<void>(`${this.backEnd}eco-news/${entityId}/comments/${id}/likes`, {});
  }

  editComment(entityId: number, id: number, text: string): Observable<void> {
    return this.http.put<void>(`${this.backEnd}eco-news/${entityId}/comments/${id}`, text);
  }
}
