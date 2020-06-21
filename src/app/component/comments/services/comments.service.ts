import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  public accessToken: string = localStorage.getItem('accessToken'); 
  private httpOptions = {
    headers: new HttpHeaders({
     'Content-type': 'Application/json',
     'Authorization': 'my-auth-token'
    })
  };
  private backEnd = environment.backendLink;
  private routeSubscription: Subscription;
  public ecoNewsId: string;

  constructor(private http: HttpClient,
              private route: ActivatedRoute) { }

  public addComment(form): any {
    const body = {
      "parentCommentId": 0,
      "text": form.value.content
    };

    this.httpOptions.headers.set('Authorization', `Bearer ${this.accessToken}`);
    return this.http.post(`https://greencity.azurewebsites.net/econews/comments/${this.ecoNewsId}`, body, this.httpOptions)
  }

  public getCommentsByPage() {
    return this.http.get(`https://greencity.azurewebsites.net/econews/comments?ecoNewsId=${this.ecoNewsId}&page=0&size=12`);
  }
}
