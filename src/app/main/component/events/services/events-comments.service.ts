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

  addComment(eventId: number, text: string, id = 0): Observable<AddedCommentDTO> {
    const body = {
      parentCommentId: id,
      text
    };

    return this.http.post<EventsAddedCommentDTO>(`${this.backEnd}events/comments/${eventId}`, body);
  }

  getActiveCommentsByPage(eventId: number, page: number, size: number): Observable<CommentsModel> {
    return this.http.get<EventsCommentsModel>(`${this.backEnd}events/comments/active?eventId=${eventId}&page=${page}&size=${size}`);
  }

  getCommentsCount(eventId: number): Observable<number> {
    return this.http.get<number>(`${this.backEnd}events/comments/count/${eventId}`);
  }

  getActiveRepliesByPage(eventId: number, parentCommentId: number, page: number, size: number): Observable<CommentsModel> {
    return this.http.get<EventsCommentsModel>(`${this.backEnd}events/comments/replies/active/${parentCommentId}?page=${page}&size=${size}`);
  }

  deleteComments(eventId: number, commentId: number) {
    return this.http.delete<object>(`${this.backEnd}events/comments/${commentId}`, { observe: 'response' }).pipe(
      map((response) => {
        if (response.status >= 200 && response.status < 300) {
          return true;
        }
        return false;
      })
    );
  }

  getCommentLikes(commentId: number): Observable<number> {
    return this.http.get<number>(`${this.backEnd}events/comments/likes/count/commentId=${commentId}`);
  }

  getRepliesAmount(eventId: number, parentCommentId: number): Observable<number> {
    return this.http.get<number>(`${this.backEnd}events/comments/replies/active/count/${parentCommentId}`);
  }

  postLike(eventId: number, commentId: number): Observable<void> {
    return this.http.post<void>(`${this.backEnd}events/comments/like?commentId=${commentId}`, {});
  }

  editComment(eventId: number, commentId: number, text: string): Observable<void> {
    return this.http.patch<void>(`${this.backEnd}events/comments?id=${commentId}`, text);
  }
}
