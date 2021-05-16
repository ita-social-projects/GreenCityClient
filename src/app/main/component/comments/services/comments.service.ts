import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environment/environment';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private backEnd = environment.backendLink;
  public ecoNewsId: string;

  constructor(private http: HttpClient) {}

  public addComment(form, id = 0): Observable<object> {
    const body = {
      parentCommentId: id,
      text: form.value.content
    };

    return this.http.post<object>(`${this.backEnd}econews/comments/${this.ecoNewsId}`, body);
  }

  public getActiveCommentsByPage(page: number, size: number): Observable<object> {
    return this.http.get<object>(`${this.backEnd}econews/comments/active?ecoNewsId=${this.ecoNewsId}&page=${page}&size=${size}`);
  }

  public getCommentsCount(id: number): Observable<number> {
    return this.http.get<number>(`${this.backEnd}econews/comments/count/comments/${id}`);
  }

  public getActiveRepliesByPage(id: number, page: number, size: number): Observable<object> {
    return this.http.get(`${this.backEnd}econews/comments/replies/active/${id}?page=${page}&size=${size}`);
  }

  public deleteComments(id: number) {
    return this.http.delete<object>(`${this.backEnd}econews/comments?id=${id}`, { observe: 'response' });
  }

  public getCommentLikes(id: number): Observable<number> {
    return this.http.get<number>(`${this.backEnd}econews/comments/count/likes?id=${id}`);
  }

  public getRepliesAmount(id: number): Observable<number> {
    return this.http.get<number>(`${this.backEnd}econews/comments/count/replies/${id}`);
  }

  public postLike(id: number): Observable<object> {
    return this.http.post<object>(`${this.backEnd}econews/comments/like?id=${id}`, {});
  }

  public editComment(id: number, form: FormControl): Observable<object> {
    const body = {
      parentCommentId: id,
      text: form.value
    };

    return this.http.patch<object>(`${this.backEnd}econews/comments?id=${id}&text=${form.value}`, body);
  }
}
