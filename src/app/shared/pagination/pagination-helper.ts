import { HttpClient, HttpParams } from '@angular/common/http';
import { PaginatedResult } from './pagination';
import { map } from 'rxjs';

export function getPaginatedResult<T>(url: string, params: HttpParams, httpClient: HttpClient) {
  const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();

  return httpClient.get<any>(url, { observe: 'response', params }).pipe(
    map((response) => {
      if (response.body) {
        paginatedResult.result = response.body.page;
        paginatedResult.pagination = {
          currentPage: response.body.currentPage,
          itemsPerPage: response.body.page.length,
          totalItems: response.body.totalElements,
          totalPages: response.body.totalPages
        };
      }
      return paginatedResult;
    })
  );
}

export function getPaginationParams<T>(paramsObject: T): HttpParams {
  let params = new HttpParams();

  for (const key in paramsObject) {
    if (paramsObject.hasOwnProperty(key) && paramsObject[key] !== undefined && paramsObject[key] !== null) {
      params = params.append(key, paramsObject[key].toString());
    }
  }

  return params;
}
