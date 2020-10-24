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
    const body = {
      id: form.id,
      tags: form.tags,
      text: form.content,
      title: form.title,
      source: form.source,
      // image: form.value.image
    };
    console.log(body);
    console.log(JSON.stringify(body));
    return this.http.put<NewsResponseDTO>(`${this.url}econews/update`, JSON.stringify(body), this.httpOptions2);
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
      // image: form.value.image
    };

    const formData = new FormData();

    if (this.files.length !== 0) {
      body.image = this.files[0].url;
    }

    formData.append('addEcoNewsDtoRequest', JSON.stringify(body));

    this.httpOptions.headers.set('Authorization', `Bearer ${this.accessToken}`);
    return this.http.post<NewsResponseDTO>(`${this.url}econews`, formData, this.httpOptions);
  }
}
