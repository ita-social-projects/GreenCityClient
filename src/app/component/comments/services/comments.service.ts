import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  public accessToken: string = localStorage.getItem('accessToken');
  private backEnd = environment.backendLink;
  private routeSubscription: Subscription;
  public ecoNewsId: string;
  public isEditing = false;

  constructor(private http: HttpClient,
              private route: ActivatedRoute) { }

  // public isCommentEditing() {
  //   this.isEditing = !this.isEditing ? true : false;

  // }

  public addComment(form): Observable<object> {
    const body = {
      parentCommentId: 0,
      text: form.value.content
    };

    return this.http.post(`${this.backEnd}econews/comments/${this.ecoNewsId}`, body);
  }

  public getCommentsByPage(): Observable<object> {
    return this.http.get(`${this.backEnd}econews/comments?ecoNewsId=${this.ecoNewsId}&page=0&size=12`);
  }

  public deleteComments(id) {
    return this.http.delete(`${this.backEnd}econews/comments?id=${id}`, {observe: 'response'});
  }

  public getCommentLikes(id: number): Observable<number> {
    return this.http.get<number>(`${this.backEnd}econews/comments/count/likes?id=${id}`);
  }

  public postLike(id: number): Observable<object> {
    return this.http.post(`${this.backEnd}econews/comments/like?id=${id}`, {});
  }

  public editComment(id: number, form): Observable<object> {
    console.log(form)
    const body = {
      parentCommentId: id,
      text: form.value
    };

    return this.http.patch(`${this.backEnd}econews/comments?id=${id}&text=${form.value}`, body);
  }
}
