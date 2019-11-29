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
        } else if (error.status === 403 && error instanceof  HttpErrorResponse) {
          return this.handle403Error(req, next); // TODO - redirect to main page
        } else if (error.status === 404 && error instanceof HttpErrorResponse) {
          return this.handle404Error(req, next); // TODO - show 404 custom page
        } else {
          console.log(`Unexpected error: ${error.message}`);
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
        switchMap((newTokenPair: any) => {
          this.jwtService.saveAccessToken(newTokenPair.accessToken);
          this.jwtService.saveRefreshToken(newTokenPair.refreshToken);
          this.isRefreshing = false;
          this.refreshTokenSubject.next(newTokenPair);
          return next.handle(this.addAccessTokenToHeader(req, newTokenPair.accessToken));
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(newTokenPair => newTokenPair != null),
        take(1),
        switchMap(newTokenPair => next.handle(this.addAccessTokenToHeader(req, newTokenPair.accessToken)))
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

  addAccessTokenToHeader(req: HttpRequest<any>, accessToken: string) {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  private handle403Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return undefined; // TODO
  }

  private handle404Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return undefined; // TODO
  }
}
