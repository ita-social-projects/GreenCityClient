import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { BehaviorSubject, EMPTY, Observable, of, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { updateAccessTokenLink } from '../../links';
import { LocalStorageService } from '../localstorage/local-storage.service';
import { BAD_REQUEST, FORBIDDEN, UNAUTHORIZED } from '../../http-response-status';
import { AuthModalComponent } from '@global-auth/auth-modal/auth-modal.component';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { UserOwnAuthService } from '@auth-service/user-own-auth.service';

interface NewTokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class InterceptorService implements HttpInterceptor {
  private refreshTokenSubject: BehaviorSubject<NewTokenPair> = new BehaviorSubject<NewTokenPair>(null);
  private isRefreshing = false;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private snackBar: MatSnackBarComponent,
    private localStorageService: LocalStorageService,
    private userOwnAuthService: UserOwnAuthService
  ) {}

  /**
   * Intercepts all HTTP requests, adds access token to authentication header (except authentication requests),
   * intercepts 400, 401, and 403 error responses.
   *
   * @param req - {@link HttpRequest}
   * @param next - {@link HttpHandler}
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('ownSecurity') || req.url.includes('googleSecurity')) {
      return next.handle(req).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 0) {
            this.openErrorWindow('error');
          }
          return throwError(error);
        })
      );
    }
    if (this.localStorageService.getAccessToken()) {
      req = this.addAccessTokenToHeader(req, this.localStorageService.getAccessToken());
    }
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === BAD_REQUEST || error.status === FORBIDDEN) {
          const message = error.error.message ? error.error.message : error.message ? error.message : 'error';
          this.openErrorWindow(message);
          return EMPTY;
        }
        if (error.status === UNAUTHORIZED) {
          return this.handleUnauthorized(req, next);
        }
        return throwError(error);
      })
    );
  }

  /**
   * Handles 401 response. It tries to get new access/refresh token pair with refresh token.
   * All of the rest request are put on hold.
   *
   * @param req - {@link HttpRequest}
   * @param next - {@link HttpHandler}
   */
  private handleUnauthorized(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
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

  /**
   * Handles a situation when refresh token is expired.
   *
   * @param error - {@link HttpErrorResponse}
   */
  private handleRefreshTokenIsNotValid(error: HttpErrorResponse): Observable<HttpEvent<any>> {
    this.isRefreshing = false;
    if (error.status === BAD_REQUEST) {
      this.localStorageService.clear();
      this.userOwnAuthService.isLoginUserSubject.next(false);
      return of<HttpEvent<any>>();
    }
    return throwError(error);
  }

  /**
   * Send refresh token in order to get new access/refresh token pair.
   *
   * @param refreshToken - {@link string} refresh token.
   */
  private getNewTokenPair(refreshToken: string): Observable<NewTokenPair> {
    return this.http.get<NewTokenPair>(`${updateAccessTokenLink}?refreshToken=${refreshToken}`);
  }

  /**
   * Adds access token to authentication header.
   *
   * @param req - {@link HttpRequest}
   * @param accessToken - {@link string} - access token key.
   */
  addAccessTokenToHeader(req: HttpRequest<any>, accessToken: string) {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  public openSignInWindow(): void {
    this.dialog.open(AuthModalComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      panelClass: 'custom-dialog-container',
      data: {
        popUpName: 'sign-in',
      },
    });
  }

  public openErrorWindow(message: string): void {
    this.snackBar.openSnackBar(message);
  }
}
