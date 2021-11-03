import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, EMPTY, Observable, of, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { updateAccessTokenLink } from '../../main/links';
import { LocalStorageService } from '../../main/service/localstorage/local-storage.service';
import { BAD_REQUEST, FORBIDDEN, UNAUTHORIZED } from '../../main/http-response-status';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { UserOwnAuthService } from '@auth-service/user-own-auth.service';
import { UBSOrderFormService } from 'src/app/main/component/ubs/services/ubs-order-form.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthModalComponent } from '@global-auth/auth-modal/auth-modal.component';

interface NewTokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {
  private refreshTokenSubject: BehaviorSubject<NewTokenPair> = new BehaviorSubject<NewTokenPair>(null);
  private isRefreshing = false;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBarComponent,
    private localStorageService: LocalStorageService,
    private router: Router,
    private userOwnAuthService: UserOwnAuthService,
    private ubsOrderFormService: UBSOrderFormService,
    private dialog: MatDialog
  ) {}

  /**
   * Intercepts all HTTP requests, adds access token to authentication header (except authentication requests),
   * intercepts 400, 401, and 403 error responses.
   *
   * @param req - {@link HttpRequest}
   * @param next - {@link HttpHandler}
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.isQueryWithSecurity(req.url)) {
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
    if (this.isQueryWithProcessOrder(req.url)) {
      return next.handle(req).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status >= 400) {
            this.ubsOrderFormService.setOrderResponseErrorStatus(true);
          }
          return throwError(error);
        })
      );
    }
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (this.checkIfErrorStatusIs(error.status, [BAD_REQUEST, FORBIDDEN])) {
          const noErrorErrorMessage = error.message ?? 'error';
          const message = error.error?.message ?? noErrorErrorMessage;
          this.openErrorWindow(message);
          return EMPTY;
        }
        if (this.checkIfErrorStatusIs(error.status, [UNAUTHORIZED])) {
          return this.handleUnauthorized(req, next);
        }
        return throwError(error);
      })
    );
  }

  private isQueryWithSecurity(url: string): boolean {
    return url.includes('ownSecurity') || url.includes('googleSecurity');
  }

  private isQueryWithProcessOrder(url: string): boolean {
    return url.includes('processOrder');
  }

  private checkIfErrorStatusIs(errorStatusCode: number, statusCodesToVerify: number[]): boolean {
    return statusCodesToVerify.some((code) => errorStatusCode === code);
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
    const currentUrl = this.router.url;
    const isUBS = currentUrl.includes('ubs');
    this.isRefreshing = false;
    this.localStorageService.clear();
    this.dialog.closeAll();
    this.userOwnAuthService.isLoginUserSubject.next(false);
    this.localStorageService.setUbsRegistration(isUBS);
    this.dialog
      .open(AuthModalComponent, {
        hasBackdrop: true,
        closeOnNavigation: true,
        panelClass: ['custom-dialog-container'],
        data: {
          popUpName: 'sign-in'
        }
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe(() => {
        this.router.navigateByUrl(currentUrl);
      });
    return of<HttpEvent<any>>();
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
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  public openErrorWindow(message: string): void {
    this.snackBar.openSnackBar(message);
  }
}
