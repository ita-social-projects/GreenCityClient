import { Injectable } from '@angular/core';
import {
  HttpClient, HttpErrorResponse, HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import { updateAccessTokenLink } from '../../links';
import {catchError, filter, switchMap, take} from 'rxjs/operators';
import {LocalStorageService} from '../localstorage/local-storage.service';
import {Router} from '@angular/router';
import {BAD_REQUEST, FORBIDDEN, NOT_FOUND, UNAUTHORIZED} from '../../http-response-status';

/**
 * @author Yurii Koval
 */
interface NewTokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * @author Yurii Koval
 */
@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {
  private refreshTokenSubject: BehaviorSubject<NewTokenPair> = new BehaviorSubject<NewTokenPair>(null);
  private isRefreshing = false;

  constructor(private http: HttpClient,
              private localStorageService: LocalStorageService,
              private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('ownSecurity') || req.url.includes('googleSecurity')) {
      return next.handle(req);
    }
    if (this.localStorageService.getAccessToken()) {
      req = this.addAccessTokenToHeader(req, this.localStorageService.getAccessToken());
    }
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === UNAUTHORIZED) {
          return this.handle401Error(req, next);
        }
        if (error.status === FORBIDDEN) {
          return this.handle403Error(req);
        }
        if (error.status === NOT_FOUND) {
          return this.handle404Error(req);
        }
        return throwError(error);
      })
    );
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      return this.getNewTokenPair(this.localStorageService.getRefreshToken()).pipe(
        catchError((error: HttpErrorResponse) => this.handleRefreshTokenIsNotValid(error)),
        switchMap((newTokenPair: NewTokenPair) => {
          this.localStorageService.setAccessToken(newTokenPair.accessToken);
          this.localStorageService.setRefreshToken(newTokenPair.refreshToken);
          this.isRefreshing = false;
          this.refreshTokenSubject.next(newTokenPair);
          return next.handle(this.addAccessTokenToHeader(req, newTokenPair.accessToken));
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((newTokenPair: NewTokenPair) => newTokenPair !== null),
        take(1),
        switchMap((newTokenPair: NewTokenPair) => next.handle(this.addAccessTokenToHeader(req, newTokenPair.accessToken))),
        catchError(() => of<HttpEvent<any>>())
      );
    }
  }

  private handleRefreshTokenIsNotValid(error: HttpErrorResponse): Observable<HttpEvent<any>> {
    if (error.status === BAD_REQUEST) {
      this.localStorageService.clear();
      this.router.navigate(['/GreenCityClient/auth']).then(r => r);
      return of<HttpEvent<any>>();
    }
    return throwError(error);
  }

  private getNewTokenPair(refreshToken: string): Observable<NewTokenPair> {
    return this.http.get<NewTokenPair>(`${updateAccessTokenLink}?refreshToken=${refreshToken}`);
  }

  addAccessTokenToHeader(req: HttpRequest<any>, accessToken: string) {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  private handle403Error(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    console.log(`You don't have authorities to access ${req.url}`);
    this.router.navigate(['/GreenCityClient/auth']).then(r => r);
    return of<HttpEvent<any>>();
  }

  private handle404Error(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    console.log(`Page does not exist ${req.url}`);
    this.router.navigate(['/error.component.html']).then(r => r);
    return of<HttpEvent<any>>();
  }
}
