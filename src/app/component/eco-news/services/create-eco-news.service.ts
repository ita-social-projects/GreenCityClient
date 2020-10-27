import { Injectable } from '@angular/core';
import { NewsDTO, NewsResponseDTO } from '../models/create-news-interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environment/environment';
import { FormGroup } from '@angular/forms';
import { FileHandle } from '../models/create-news-interface';

@Injectable({
  providedIn: 'root'
})
export class CreateEcoNewsService {
  private newsId: string;
  private currentForm: FormGroup;
  private url: string = environment.backendLink;
  private accessToken: string = localStorage.getItem('accessToken');
  public files: FileHandle[] = [];
  public fileUrl: string;
  public isImageValid: boolean;
  public isBackToEditing: boolean;
  private httpOptions = {
    headers: new HttpHeaders({
      Authorization: 'my-auth-token'
    }),

  };
  private httpOptions2 = {
    headers: new HttpHeaders({
      'Content-Type': 'multipart/form-data'
    })
  };


  constructor(private http: HttpClient) { }

  public getFormData(): FormGroup {
    return this.currentForm;
  }

  public getNewsId(): string {
    return this.newsId;
  }

  public editNews(form): Observable<NewsResponseDTO> {
    const body: NewsDTO = {
      id: form.id,
      tags: form.tags,
      text: form.content,
      title: form.title,
      source: form.source,
    };

    const formData = new FormData();

    formData.append('id', body.id);
    formData.append('tags', JSON.stringify(body.tags));
    formData.append('text', body.text);
    formData.append('title', body.title);
    formData.append('source', body.source);

    return this.http.put<NewsResponseDTO>(`${this.url}econews/update`, formData);
  }

  public setForm(form: FormGroup): void {
    this.currentForm = form;
    console.log(this.currentForm.value);
    if (this.currentForm) {
      this.currentForm.value.image = this.files[0] ?
      this.files[0].url : '';
    }
  }

  public setNewsId(id: string): void {
    this.newsId = id;
    console.log(this.newsId);
  }

  public sendFormData(form): Observable<NewsResponseDTO> {
    const body: NewsDTO = {
      tags: form.value.tags,
      text: form.value.content,
      title: form.value.title,
      source: form.value.source,
    };

    const formData = new FormData();

    if (this.files.length !== 0) {
      body.image = this.files[0].url;
    }
    this.files = [];
    formData.append('addEcoNewsDtoRequest', JSON.stringify(body));
    console.log(formData);
    this.httpOptions.headers.set('Authorization', `Bearer ${this.accessToken}`);
    return this.http.post<NewsResponseDTO>(`${this.url}econews`, formData, this.httpOptions);
  }
}
