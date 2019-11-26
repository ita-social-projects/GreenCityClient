import { Injectable } from '@angular/core';
import {
  HttpClient, HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { frontAuthLink, updateAccessTokenLink } from '../links';
import { catchError, switchMap } from 'rxjs/operators';
import { AccessToken } from '../model/access-token';
import { JwtService } from './jwt.service';


@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private http: HttpClient, private jwtService: JwtService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.url.includes(updateAccessTokenLink)) {
      const accessToken = this.jwtService.getAccessToken();
      if (accessToken != null) {
        if (this.jwtService.isTokenValid(accessToken)) {
          req = this.addAccessTokenToHeader(req, accessToken);
          return next.handle(req).pipe(
            catchError((err: HttpErrorResponse) => {
              if (err.status === 401) {
                this.clearLocalStorageAndRedirectToAuthPage();
              }
              return throwError(err);
            }
            )
          );
        } else {
          const refreshToken = this.jwtService.getRefreshToken();
          if (refreshToken != null) {
            if (this.jwtService.isTokenValid(refreshToken)) {
              return this.getNewAccessToken(refreshToken).pipe(
                switchMap((data: AccessToken) => {
                  this.jwtService.saveAccessToken(data.accessToken);
                  req = this.addAccessTokenToHeader(req, data.accessToken);
                  return next.handle(req);
                })
              );
            } else {
              this.clearLocalStorageAndRedirectToAuthPage();
            }
          }
        }
      } else {
        return next.handle(req).pipe(
          catchError((error) => {
            if (error instanceof HttpErrorResponse) {
              if (error.error instanceof ErrorEvent) {
                console.error('Error Event');
              } else {
                switch (error.status) {
                  case 400:
                    console.log('Error 400');
                    break;
                  case 401:
                    console.log('Error 401');
                    break;
                  case 403:
                    console.log('Error 403');
                    break;
                  case 404:
                    console.log('Error 404');
                    break;
                  default:
                    console.log('Unknown error occured');
                    break;
                }
              }
            } else {
              console.error('some thing else happened');
            }
            return throwError(error);
          })
        );
      }
    } else {
      return next.handle(req).pipe(
        catchError((error) => {
          if (error instanceof HttpErrorResponse) {
            if (error.error instanceof ErrorEvent) {
              console.error('Error Event');
            } else {
              switch (error.status) {
                case 0:
                  console.log('Unknown error occured');
                  break;
                case 400:
                  console.log('Error 400');
                  break;
                case 401:
                  console.log('Error 401');
                  break;
                case 403:
                  console.log('Error 403');
                  break;
                default:
                  console.log('Unknown error occured');
                  break;
              }
            }
          } else {
            console.error('some thing else happened');
          }
          return throwError(error);
        })
      );
    }
  }

  private clearLocalStorageAndRedirectToAuthPage() {
    localStorage.clear();
    window.location.href = frontAuthLink;
  }

  private getNewAccessToken(refreshToken: string): Observable<any> {
    console.log('update access Token');
    return this.http.get(`${updateAccessTokenLink}?refreshToken=${refreshToken}`);
  }

  private addAccessTokenToHeader(req: HttpRequest<any>, accessToken: string) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    }
    );
    return req;
  }
}
