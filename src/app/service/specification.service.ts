import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {CategoryDto} from '../model/category.model';
import {mainLink} from '../links';
import {SpecificationNameDto} from "../model/specification/SpecificationNameDto";
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class SpecificationService extends BaseService {

  constructor(protected http: HttpClient) {
    super(http);
    this.apiUrl += '/specification';
  }

  // findAllSpecification(): any {
  //   return this.http.get<SpecificationNameDto[]>(`${mainLink}specification`)
  // }

  findAllSpecification(): Observable<SpecificationNameDto[]> {
    return this.http.get<SpecificationNameDto[]>(`http://localhost:8080/specification`);
  }
}

