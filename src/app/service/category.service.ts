import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoryDto } from '../model/category.model';
import { mainLink } from '../links';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${mainLink}` + '/category';
  }

  save(category: CategoryDto) {
    return this.http.post(`${mainLink}category`, category);
  }

  findAllCategory(): any {
    return this.http.get<CategoryDto[]>(`${mainLink}category`);
  }
}
