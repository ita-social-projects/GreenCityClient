import {Injectable} from '@angular/core';
import {
  HttpClient,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {frontAuthLink, updateAccessTokenLink} from '../links';
import {switchMap} from 'rxjs/operators';
import {AccessToken} from '../model/access-token';
import {JwtService} from './jwt.service';


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
          return next.handle(req);
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
              localStorage.clear();
              window.location.href = frontAuthLink;
            }
          }
        }
      } else {
        return next.handle(req);
      }
    } else {
      return next.handle(req);
    }
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
