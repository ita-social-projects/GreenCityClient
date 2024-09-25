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

  addComment(ecoNewsId: number, text: string, id = 0): Observable<AddedCommentDTO> {
    const body = { parentCommentId: id, text };
    return this.http.post<EcoNewsAddedCommentDTO>(`${this.backEnd}eco-news/${ecoNewsId}/comments`, body);
  }

  getActiveCommentsByPage(ecoNewsId: number, page: number, size: number): Observable<CommentsModel> {
    return this.http.get<EcoNewsCommentsModel>(
      `${this.backEnd}eco-news/${ecoNewsId}/comments/active?statuses=ORIGINAL,EDITED&page=${page}&size=${size}`
    );
  }

  getCommentsCount(ecoNewsId: number): Observable<number> {
    return this.http.get<number>(`${this.backEnd}eco-news/${ecoNewsId}/comments/count`);
  }

  getActiveRepliesByPage(ecoNewsId: number, parentCommentId: number, page: number, size: number): Observable<CommentsModel> {
    return this.http.get<EcoNewsCommentsModel>(
      `${this.backEnd}eco-news/${ecoNewsId}/comments/${parentCommentId}/replies/active?statuses=ORIGINAL,EDITED&page=${page}&size=${size}`
    );
  }

  deleteComments(ecoNewsId: number, parentCommentId: number) {
    return this.http
      .delete<object>(`${this.backEnd}eco-news/comments/${ecoNewsId}`, { observe: 'response' })
      .pipe(map((response) => response.status >= 200 && response.status < 300));
  }

  getCommentLikes(ecoNewsId: number, parentCommentId: number): Observable<number> {
    return this.http.get<number>(`${this.backEnd}eco-news/${ecoNewsId}/comments/${parentCommentId}/likes/count`);
  }

  getRepliesAmount(ecoNewsId: number, parentCommentId: number): Observable<number> {
    return this.http.get<number>(`${this.backEnd}eco-news/${ecoNewsId}/comments/${parentCommentId}/replies/active/count`);
  }

  postLike(ecoNewsId: number, commentId: number): Observable<void> {
    return this.http.post<void>(`${this.backEnd}eco-news/comments/like?commentId=${commentId}`, {});
  }

  editComment(ecoNewsId: number, commentId: number, text: string): Observable<void> {
    return this.http.patch<void>(`${this.backEnd}eco-news/comments?commentId=${commentId}`, text);
  }
}
