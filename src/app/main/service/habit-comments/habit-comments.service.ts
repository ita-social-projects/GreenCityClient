import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@environment/environment';
import { CommentsService } from 'src/app/main/component/comments/services/comments.service';
import { AddedCommentDTO, CommentsModel } from 'src/app/main/component/comments/models/comments-model';
import { HabitAddedCommentDTO, HabitCommentsModel } from '@global-user/components/habit/models/habits-comments.model';

@Injectable({
  providedIn: 'root'
})
export class HabitCommentsService implements CommentsService {
  private readonly backEnd = environment.backendLink;

  constructor(private readonly http: HttpClient) {}

  addComment(habitId: number, text: string, parentCommentId = 0): Observable<AddedCommentDTO> {
    const formData = new FormData();
    const requestPayload = {
      text: text,
      parentCommentId: parentCommentId
    };

    formData.append('request', JSON.stringify(requestPayload));

    return this.http.post<HabitAddedCommentDTO>(`${this.backEnd}habits/${habitId}/comments`, formData);
  }

  getActiveCommentsByPage(habitId: number, page: number, size: number): Observable<CommentsModel> {
    const url = `${this.backEnd}habits/comments/active?habitId=${habitId}&page=${page}&size=${size}`;
    return this.http.get<HabitCommentsModel>(url);
  }

  getCommentsCount(habitId: number): Observable<number> {
    return this.http.get<number>(`${this.backEnd}habits/${habitId}/comments/count`);
  }

  getActiveRepliesByPage(habitId: number, parentCommentId: number, page: number, size: number): Observable<CommentsModel> {
    const url = `${this.backEnd}habits/comments/${parentCommentId}/replies/active?page=${page}&size=${size}`;
    return this.http.get<HabitCommentsModel>(url);
  }

  deleteComments(commentId: number): Observable<boolean> {
    return this.http
      .delete<void>(`${this.backEnd}habits/comments/${commentId}`, { observe: 'response' })
      .pipe(map((response) => response.status >= 200 && response.status < 300));
  }

  getRepliesAmount(habitId: number, commentId: number): Observable<number> {
    const url = `${this.backEnd}habits/comments/${commentId}/replies/active/count`;
    return this.http.get<number>(url);
  }

  postLike(commentId: number): Observable<void> {
    return this.http.post<void>(`${this.backEnd}habits/comments/like?commentId=${commentId}`, {});
  }

  getCommentLikes(habitId: number, commentId: number): Observable<number> {
    return this.http.get<number>(`${this.backEnd}habits/comments/${commentId}/likes/count`);
  }

  editComment(id: number, text: string): Observable<void> {
    return this.http.patch<void>(`${this.backEnd}habits/comments?id=${id}`, { text });
  }

  getCommentById(commentId: number): Observable<CommentsModel> {
    return this.http.get<CommentsModel>(`${this.backEnd}habits/comments/${commentId}`);
  }
}
