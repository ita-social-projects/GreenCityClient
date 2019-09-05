import {Injectable} from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {frontAuthLink, updateAccessTokenLink} from "../links";
import {catchError, delay, map, switchMap} from "rxjs/operators";
import {AccessToken} from "../model/access-token";
import {JwtService} from "./jwt.service";


@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private http: HttpClient, private jwtService: JwtService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url != updateAccessTokenLink) {
      let accessToken = this.jwtService.getAccessToken();
      if (accessToken != null) {
        console.log("access token != null");
        if (this.jwtService.isTokenValid(accessToken)) {
          console.log("access token is valid");
          req = this.addAccessTokenToHeader(req, accessToken);
          return next.handle(req);
        } else {
          console.log("access token is invalid");
          let refreshToken = this.jwtService.getRefreshToken();
          if (refreshToken != null) {
            console.log("refresh token != null");
            if (this.jwtService.isTokenValid(refreshToken)) {
              console.log("refresh token is valid");

              return this.getNewAccessToken(refreshToken).pipe(
                switchMap((data: AccessToken) => {
                  console.log(data);
                  this.jwtService.saveAccessToken(data.accessToken);
                  req = this.addAccessTokenToHeader(req, data.accessToken);
                  console.log(req);
                  return next.handle(req);
                })
              );
            } else {
              localStorage.clear();
              console.log("front: bad refresh token");
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

  private getNewAccessToken(refreshToken): Observable<any> {
    return this.http.post(updateAccessTokenLink, refreshToken);
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
