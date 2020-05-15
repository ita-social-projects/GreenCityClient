import { Injectable } from '@angular/core';
import { NewsModel, TranslationModel, NewsDTO, NewsResponseDTO } from '../../component/eco-news/create-news/create-news-interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
import { FormGroup } from '@angular/forms';
import { FileHandle } from '../../component/eco-news/create-news/create-news-interface';

@Injectable({
  providedIn: 'root'
})
export class CreateEcoNewsService {
  private currentForm: FormGroup;
  private url: string = environment.backendLink;
  private accessToken: string = localStorage.getItem('accessToken');
  public files: FileHandle[] = [];
  private httpOptions = {
    headers: new HttpHeaders({
      'Authorization': 'my-auth-token'
    })
  };

  constructor(private http: HttpClient) { }

  public getFormData(): FormGroup {
    return this.currentForm;
  }

  public setForm(form: FormGroup): void {
    this.currentForm = form;
    this.currentForm.value.image = this.files[0] ?
      this.files[0].url : '';
  }

  public sendFormData(form): Observable<NewsResponseDTO> {
    const body: NewsDTO = {
      "tags": form.value.tags,
      "text": form.value.content,
      "title": form.value.title,
    };
    let formData:FormData = new FormData();

    formData.append('image', this.files[0].file, this.files[0].file.name);
    formData.append('addEcoNewsDtoRequest', JSON.stringify(body));

    this.httpOptions.headers.set('Authorization', `Bearer ${this.accessToken}`);
    return this.http.post<NewsResponseDTO>(`${this.url}/econews`, formData, this.httpOptions);
  }
}
