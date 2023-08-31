import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@environment/environment';
import { CommentsService } from '../../comments/services/comments.service';
import { AddedCommentDTO, CommentsModel } from '../../comments/models/comments-model';
import { EventsAddedCommentDTO, EventsCommentsModel } from '../models/events-comments.model';

@Injectable({
  providedIn: 'root'
})
export class EventsCommentsService implements CommentsService {
  private backEnd = environment.backendLink;

  constructor(private http: HttpClient) {}

  public addComment(entityId: number, text: string, id = 0): Observable<AddedCommentDTO> {
    const body = {
      parentCommentId: id,
      text
    };

    return this.http.post<EventsAddedCommentDTO>(`${this.backEnd}events/comments/${entityId}`, body);
  }

  public getActiveCommentsByPage(entityId: number, page: number, size: number): Observable<CommentsModel> {
    return this.http.get<EventsCommentsModel>(`${this.backEnd}events/comments/active?eventId=${entityId}&page=${page}&size=${size}`);
  }

  public getCommentsCount(entityId: number): Observable<number> {
    return this.http.get<number>(`${this.backEnd}events/comments/count/${entityId}`);
  }

  public getActiveRepliesByPage(id: number, page: number, size: number): Observable<CommentsModel> {
    return this.http.get<EventsCommentsModel>(`${this.backEnd}events/comments/replies/active/${id}?page=${page}&size=${size}`);
  }

  public deleteComments(id: number) {
    return this.http.delete<object>(`${this.backEnd}events/comments/${id}`, { observe: 'response' }).pipe(
      map((response) => {
        if (response.status >= 200 && response.status < 300) {
          return true;
        }
        return false;
      })
    );
  }

  public getCommentLikes(id: number): Observable<number> {
    return this.http.get<number>(`${this.backEnd}events/comments/likes/count/commentId=${id}`);
  }

  public getRepliesAmount(id: number): Observable<number> {
    return this.http.get<number>(`${this.backEnd}events/comments/replies/active/count/${id}`);
  }

  public postLike(id: number): Observable<void> {
    return this.http.post<void>(`${this.backEnd}events/comments/like?commentId=${id}`, {});
  }

  public editComment(id: number, text: string): Observable<void> {
    const body = {
      parentCommentId: id,
      text
    };

    return this.http.patch<void>(`${this.backEnd}events/comments?commentText=${text}&id=${id}`, body);
  }
}
