import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environment/environment';
import { TableDataResponse, TablesResponse } from '../models/table.model';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  url = environment.backendLink;
  constructor(private readonly http: HttpClient) {}

  getTableNames(): Observable<TablesResponse> {
    return this.http.get<TablesResponse>(`${this.url}export/settings/tables`);
  }

  getTableData(name: string, page = 0, size = 20): Observable<TableDataResponse> {
    return this.http.get<TableDataResponse>(`${this.url}export/settings/select?tableName=${name}&page=${page}&size=${size}`);
  }
}
