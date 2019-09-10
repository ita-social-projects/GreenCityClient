import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {mainLink} from '../links';

export abstract class BaseService {

  protected apiUrl = `${mainLink}`;

  constructor(protected http: HttpClient) {}

  protected log(message) {
    console.log(message);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  protected handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error(error); // log to console instead

      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
