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


@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private http: HttpClient) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url != updateAccessTokenLink) {
      let accessToken = localStorage.getItem("accessToken");
      if (accessToken != null) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${accessToken}`
          }
        });
      }
      return next.handle(req).pipe(catchError((error: HttpErrorResponse) => {
        if (error.status == 403) {

          let refreshToken = localStorage.getItem("refreshToken");

          if (refreshToken != null) {
            this.http.post(updateAccessTokenLink, refreshToken).subscribe(
              (data: AccessToken) => {
                localStorage.setItem("accessToken", data.accessToken)
              },
              (error1: HttpErrorResponse) => {
                if (error1.status == 401) {
                  window.location.href = frontAuthLink;
                  localStorage.clear();
                }
                console.log(error1);
              }
            )
          }
        }
        return throwError(error);
      }));
    } else {
      return next.handle(req);
    }
  }
}
