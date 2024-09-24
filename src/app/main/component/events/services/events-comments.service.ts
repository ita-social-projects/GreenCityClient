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
    const body = { parentCommentId: id, text };
    return this.http.post<EventsAddedCommentDTO>(`${this.backEnd}events/${eventId}/comments`, body);
  }

  getActiveCommentsByPage(eventId: number, page: number, size: number): Observable<CommentsModel> {
    const url = `${this.backEnd}events/${eventId}/comments?statuses=ORIGINAL,EDITED&page=${page}&size=${size}`;
    return this.http.get<EventsCommentsModel>(url);
  }

  getCommentsCount(eventId: number): Observable<number> {
    return this.http.get<number>(`${this.backEnd}events/${eventId}/comments/count`);
  }

  getActiveRepliesByPage(eventId: number, parentCommentId: number, page: number, size: number): Observable<CommentsModel> {
    const url = `${this.backEnd}events/${eventId}/comments/${parentCommentId}/replies?statuses=ORIGINAL,EDITED&page=${page}&size=${size}`;
    return this.http.get<EventsCommentsModel>(url);
  }

  deleteComments(eventId: number, commentId: number): Observable<boolean> {
    return this.http
      .delete<object>(`${this.backEnd}events/${eventId}/comments/${commentId}`, { observe: 'response' })
      .pipe(map((response) => response.status >= 200 && response.status < 300));
  }

  getCommentLikes(eventId: number, commentId: number): Observable<number> {
    return this.http.get<number>(`${this.backEnd}events/${eventId}/comments/${commentId}/likes/count`);
  }

  getRepliesAmount(eventId: number, commentId: number): Observable<number> {
    return this.http.get<number>(`${this.backEnd}events/${eventId}/comments/${commentId}/replies/count`);
  }

  postLike(eventId: number, commentId: number): Observable<void> {
    return this.http.post<void>(`${this.backEnd}events/${eventId}/comments/${commentId}/likes`, {});
  }

  editComment(eventId: number, commentId: number, text: string): Observable<void> {
    return this.http.put<void>(`${this.backEnd}events/${eventId}/comments/${commentId}`, text);
  }
}
