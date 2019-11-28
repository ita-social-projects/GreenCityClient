import { Injectable } from '@angular/core';
import {
  HttpClient, HttpErrorResponse, HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import { frontAuthLink, updateAccessTokenLink } from '../links';
import {catchError, filter, switchMap, take} from 'rxjs/operators';
import { JwtService } from './jwt.service';


@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private isRefreshing = false;

  constructor(private http: HttpClient, private jwtService: JwtService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // console.log(req.url);
    if (this.jwtService.getAccessToken() && !req.url.includes('ownSecurity/')) {
      req = this.addAccessTokenToHeader(req, this.jwtService.getAccessToken());
    }
    return next.handle(req).pipe(
      catchError(error => {
        console.log('catchError: ' + req.url);
        if (error.status === 401 && error instanceof HttpErrorResponse) {
          return this.handle401Error(req, next);
        } else {
          return throwError(error);
        }
      })
    );
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      return this.getNewAccessToken(this.jwtService.getRefreshToken()).pipe(
        switchMap((pair: any) => {
          console.log('pair.accessToken ' + pair.accessToken);
          console.log('pair.refreshToken ' + pair.refreshToken);
          localStorage.setItem('accessToken', pair.accessToken);
          localStorage.setItem('refreshToken', pair.refreshToken);
          this.isRefreshing = false;
          this.refreshTokenSubject.next(pair);
          return next.handle(this.addAccessTokenToHeader(req, pair.accessToken));
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => {
          const x = token != null;
          if (x) {
            console.log('token.accessToken ' + token.accessToken);
            console.log('token.refreshToken ' + token.refreshToken);
          }
          return x;
        }),
        take(1),
        switchMap(pair => {
          console.log('asdfasd.accessToken ' + pair.accessToken);
          console.log('asdceawe.refreshToken ' + pair.refreshToken);
          return next.handle(this.addAccessTokenToHeader(req, pair.accessToken));
        })
      );
    }
  }

  private clearLocalStorageAndRedirectToAuthPage() {
    localStorage.clear();
    window.location.href = frontAuthLink;
  }

  private getNewAccessToken(refreshToken: string): Observable<any> {
    return this.http.get(`${updateAccessTokenLink}?refreshToken=${refreshToken}`);
  }

  private addAccessTokenToHeader(req: HttpRequest<any>, accessToken: string) {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    }
    );
  }
}
