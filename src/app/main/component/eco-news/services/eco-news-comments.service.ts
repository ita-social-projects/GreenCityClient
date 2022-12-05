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

  public addComment(entityId: number, text: string, id = 0): Observable<AddedCommentDTO> {
    const body = {
      parentCommentId: id,
      text
    };

    return this.http.post<EcoNewsAddedCommentDTO>(`${this.backEnd}econews/comments/${entityId}`, body);
  }

  public getActiveCommentsByPage(entityId: number, page: number, size: number): Observable<CommentsModel> {
    return this.http.get<EcoNewsCommentsModel>(`${this.backEnd}econews/comments/active?ecoNewsId=${entityId}&page=${page}&size=${size}`);
  }

  public getCommentsCount(entityId: number): Observable<number> {
    return this.http.get<number>(`${this.backEnd}econews/comments/count/comments/${entityId}`);
  }

  public getActiveRepliesByPage(id: number, page: number, size: number): Observable<CommentsModel> {
    return this.http.get<EcoNewsCommentsModel>(`${this.backEnd}econews/comments/replies/active/${id}?page=${page}&size=${size}`);
  }

  public deleteComments(id: number) {
    return this.http.delete<object>(`${this.backEnd}econews/comments?id=${id}`, { observe: 'response' }).pipe(
      map((response) => {
        if (response.status >= 200 && response.status < 300) {
          return true;
        }
        return false;
      })
    );
  }

  public getCommentLikes(id: number): Observable<number> {
    return this.http.get<number>(`${this.backEnd}econews/comments/count/likes?id=${id}`);
  }

  public getRepliesAmount(id: number): Observable<number> {
    return this.http.get<number>(`${this.backEnd}econews/comments/count/replies/${id}`);
  }

  public postLike(id: number): Observable<void> {
    return this.http.post<void>(`${this.backEnd}econews/comments/like?id=${id}`, {});
  }

  public editComment(id: number, text: string): Observable<void> {
    const body = {
      parentCommentId: id,
      text
    };

    return this.http.patch<void>(`${this.backEnd}econews/comments?id=${id}&text=${text}`, body);
  }
}
