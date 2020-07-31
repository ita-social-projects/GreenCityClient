import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { environment } from '@environment/environment';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  public repliesSubject = new Subject<boolean>();
  public likesSubject = new Subject<object>();
  public repliesVisibility = false;
  public likesCounter = 0;
  public accessToken: string = localStorage.getItem('accessToken');
  private backEnd = environment.backendLink;
  private routeSubscription: Subscription;
  public ecoNewsId: string;
  public isEditing = false;
  private commentId: number;
  constructor(private http: HttpClient,
              private route: ActivatedRoute) { }

  public addComment(id = 0, form): Observable<object> {
    const body = {
      parentCommentId: id,
      text: form.value.content
    };

    return this.http.post<object>(`${this.backEnd}econews/comments/${this.ecoNewsId}`, body);
  }

  public setCommentId(id: number): void {
    this.commentId = id;
  }

  public setLikes(likes: number): void {
    this.likesSubject
      .next({ likes, id: this.commentId });
  }

  public setVisibility(): void {
    this.repliesVisibility = !this.repliesVisibility;
    this.repliesSubject
      .next(this.repliesVisibility);
  }

  public getCommentsByPage(): Observable<object> {
    return this.http.get<object>(`${this.backEnd}econews/comments?ecoNewsId=${this.ecoNewsId}&page=0&size=12`);
  }

  public getCommentsCount(id: number): Observable<number> {
    return this.http.get<number>(`${this.backEnd}econews/comments/count/comments/${id}`);
  }

  public getAllReplies(id: number): Observable<object> {
    return this.http.get(`${this.backEnd}econews/comments/replies/${id}`);
  }
  public deleteComments(id) {
    return this.http.delete<object>(`${this.backEnd}econews/comments?id=${id}`, {observe: 'response'});
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
