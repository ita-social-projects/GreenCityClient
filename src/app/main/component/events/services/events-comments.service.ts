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

  addComment(entityId: number, text: string, id = 0): Observable<AddedCommentDTO> {
    const body = {
      parentCommentId: id,
      text
    };

    return this.http.post<EventsAddedCommentDTO>(`${this.backEnd}events/comments/${entityId}`, body);
  }

  getActiveCommentsByPage(entityId: number, status: string, page: number, size: number): Observable<CommentsModel> {
    return this.http.get<EventsCommentsModel>(`${this.backEnd}events/comments/active?eventId=${entityId}&page=${page}&size=${size}`);
  }

  getCommentsCount(entityId: number): Observable<number> {
    return this.http.get<number>(`${this.backEnd}events/comments/count/${entityId}`);
  }

  getActiveRepliesByPage(entityId: number, id: number, status: string, page: number, size: number): Observable<CommentsModel> {
    return this.http.get<EventsCommentsModel>(`${this.backEnd}events/comments/replies/active/${id}?page=${page}&size=${size}`);
  }

  deleteComments(id: number) {
    return this.http.delete<object>(`${this.backEnd}events/comments/${id}`, { observe: 'response' }).pipe(
      map((response) => {
        if (response.status >= 200 && response.status < 300) {
          return true;
        }
        return false;
      })
    );
  }

  getCommentLikes(id: number): Observable<number> {
    return this.http.get<number>(`${this.backEnd}events/comments/likes/count/commentId=${id}`);
  }

  getRepliesAmount(id: number): Observable<number> {
    return this.http.get<number>(`${this.backEnd}events/comments/replies/active/count/${id}`);
  }

  postLike(id: number): Observable<void> {
    return this.http.post<void>(`${this.backEnd}events/comments/like?commentId=${id}`, {});
  }

  editComment(entityId: number, id: number, text: string): Observable<void> {
    return this.http.patch<void>(`${this.backEnd}events/comments?id=${id}`, text);
  }
}
