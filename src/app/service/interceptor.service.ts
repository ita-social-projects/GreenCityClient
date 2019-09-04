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
import {catchError} from "rxjs/operators";
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

              this.http.post(updateAccessTokenLink, refreshToken).subscribe(
                (data: AccessToken) => {
                  this.jwtService.saveAccessToken(data.accessToken);
                  this.addAccessTokenToHeader(req, data.accessToken);
                  console.log("access token is updated");
                  return next.handle(req);
                },
                (error: HttpErrorResponse) => {
                  if (error.status == 401) {
                    localStorage.clear();
                    console.log("back-end: bad refresh token");
                    window.location.href = frontAuthLink;
                  }
                  console.log(error);
                }
              );
              console.log("return");
              ///////////////////////////////////////////
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

  private addAccessTokenToHeader(req: HttpRequest<any>, accessToken) {
    req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    return req;
  }
}
