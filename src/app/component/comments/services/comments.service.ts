import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  public repliesSubject = new Subject<boolean>();
  public repliesVisibility = false;
  public accessToken: string = localStorage.getItem('accessToken');
  private backEnd = environment.backendLink;
  private routeSubscription: Subscription;
  public ecoNewsId: string;

  constructor(private http: HttpClient,
              private route: ActivatedRoute) { }

  public addComment(id = 0, form): Observable<object> {
    const body = {
      parentCommentId: id,
      text: form.value.content
    };

    return this.http.post(`${this.backEnd}econews/comments/${this.ecoNewsId}`, body);
  }

  public setVisibility(): void {
    this.repliesVisibility = !this.repliesVisibility;
    this.repliesSubject
      .next(this.repliesVisibility);
  }

  public getCommentsByPage(): Observable<object> {
    return this.http.get(`${this.backEnd}econews/comments?ecoNewsId=${this.ecoNewsId}&page=0&size=12`);
  }

  public getAllReplies(id: number): Observable<object> {
    return this.http.get(`${this.backEnd}econews/comments/replies/${id}`);
  }
  public deleteComments(id) {
    return this.http.delete(`${this.backEnd}econews/comments?id=${id}`, {observe: 'response'});
  }

  public getCommentLikes(id: number): Observable<number> {
    return this.http.get<number>(`${this.backEnd}econews/comments/count/likes?id=${id}`);
  }

  public getRepliesAmount(id: number): Observable<number> {
    return this.http.get<number>(`${this.backEnd}econews/comments/count/replies?parentCommentId=${id}`);
}

  public postLike(id: number): Observable<object> {
    return this.http.post(`${this.backEnd}econews/comments/like?id=${id}`, {});
  }
}
