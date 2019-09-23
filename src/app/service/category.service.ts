import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {CategoryDto} from '../model/category.model';
import {mainLink} from '../links';

@Injectable({providedIn: 'root'})
export class CategoryService extends BaseService {

  constructor(protected http: HttpClient) {
    super(http);
    this.apiUrl += '/category';
  }

  save(category: CategoryDto) {
    return this.http.post(`${mainLink}category`, category);
  }

  // findAllCategory(): any {
  //    return this.http.get<CategoryDto[]>(`${mainLink}category`);

  findAllCategory(): any {
    return this.http.get<CategoryDto[]>(`http:///localhost:8080/category`);

    // return this.http.get<CategoryDto[]>(`${this.apiUrl}/categories`);
  }

}
