import { Injectable } from '@angular/core';
import {
  HttpClient, HttpErrorResponse, HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import { updateAccessTokenLink } from '../../links';
import {catchError, filter, switchMap, take} from 'rxjs/operators';
import {LocalStorageService} from '../localstorage/local-storage.service';
import {Router} from '@angular/router';

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
    if (req.url.includes('ownSecurity/')) {
      return next.handle(req);
    }
    if (this.localStorageService.getAccessToken()) {
      req = this.addAccessTokenToHeader(req, this.localStorageService.getAccessToken());
    }
    return next.handle(req).pipe(
      catchError(error => {
        if (error.status === 401 && error instanceof HttpErrorResponse) {
          return this.handle401Error(req, next);
        } else if (error.status === 403 && error instanceof  HttpErrorResponse) {
          return this.handle403Error(req, next);
        } else if (error.status === 404 && error instanceof HttpErrorResponse) {
          return this.handle404Error(req, next);
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
      return this.getNewTokenPair(this.localStorageService.getRefreshToken()).pipe(
        catchError(error => {
          if (error.status === 400 && error instanceof HttpErrorResponse) {
            this.localStorageService.clear();
            this.router.navigate(['/GreenCityClient/auth'])
              .then(success => console.log('redirect has succeeded ' + success))
              .catch(fail => console.log('redirect has failed ' + fail));
            return next.handle(req);
          } else {
            return throwError(error);
          }
        }),
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
        filter((newTokenPair: NewTokenPair) => newTokenPair != null),
        take(1),
        switchMap((newTokenPair: NewTokenPair) => next.handle(this.addAccessTokenToHeader(req, newTokenPair.accessToken)))
      );
    }
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

  private handle403Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.router.navigate(['/GreenCityClient/auth'])
      .then(success => console.log('redirect has succeeded ' + success))
      .catch(fail => console.log('redirect has failed ' + fail));
    return next.handle(req);
  }

  private handle404Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.router.navigate(['/error.component.html'])
      .then(success => console.log('redirect has succeeded ' + success))
      .catch(fail => console.log('redirect has failed ' + fail));
    return next.handle(req);
  }
}
