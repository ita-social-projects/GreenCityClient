import { Injectable } from '@angular/core';
import { NewsDTO, FileHandle } from '../models/create-news-interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environment/environment';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { EcoNewsModel } from '@eco-news-models/eco-news-model';
import { FilterModel } from '@shared/components/tag-filter/tag-filter.model';

@Injectable({
  providedIn: 'root'
})
export class CreateEcoNewsService {
  newsId: number;
  currentForm: FormGroup;
  private url: string = environment.backendLink;
  private accessToken: string = localStorage.getItem('accessToken');
  files: FileHandle[] = [];
  fileUrl: string;
  isImageValid: boolean;
  isBackToEditing: boolean;
  private httpOptions = {
    headers: new HttpHeaders({
      Authorization: 'my-auth-token'
    })
  };
  private tags: FilterModel[] = [];

  constructor(
    private http: HttpClient,
    private store: Store
  ) {}

  getFormData(): FormGroup {
    return this.currentForm;
  }

  getTags(): FilterModel[] {
    return this.tags;
  }

  setTags(tags: FilterModel[]): void {
    this.tags = tags;
  }

  getNewsId(): number {
    return this.newsId;
  }

  editNews(form): Observable<EcoNewsModel> {
    let body: NewsDTO = {
      id: form.id,
      tags: form.tags,
      content: form.content,
      title: form.title,
      source: form.source,
      text: form.content,
      countOfEcoNews: form.countOfEcoNews
    };

    const formData = new FormData();

    if (this.files.length !== 0) {
      body = {
        ...body,
        image: this.files[0].url
      };
    }
    this.files = [];
    formData.append('updateEcoNewsDto', JSON.stringify(body));
    this.httpOptions.headers.set('Authorization', `Bearer ${this.accessToken}`);

    return this.http.put<EcoNewsModel>(environment.backendLink + 'econews/update', formData, this.httpOptions);
  }

  setForm(form: FormGroup): void {
    this.currentForm = form;
    if (this.currentForm) {
      this.currentForm.value.image = this.files[0] ? this.files[0].url : this.fileUrl;
    }
  }

  setNewsId(id: number): void {
    this.newsId = id;
  }

  sendFormData(form): Observable<EcoNewsModel> {
    const body: NewsDTO = {
      tags: form.tags,
      text: form.content,
      title: form.title,
      source: form.source,
      countOfEcoNews: form.countOfEcoNews
    };

    const formData = new FormData();

    if (this.files.length !== 0) {
      body.image = this.files[0].url;
    }
    this.files = [];

    formData.append('addEcoNewsDtoRequest', JSON.stringify(body));
    this.httpOptions.headers.set('Authorization', `Bearer ${this.accessToken}`);
    return this.http.post<EcoNewsModel>(`${this.url}econews`, formData, this.httpOptions);
  }

  sendImagesData(imagesFilesArr: File[]): Observable<[string]> {
    const formData: FormData = new FormData();

    imagesFilesArr.forEach((f: File) => {
      formData.append('images', f);
    });

    const accessToken: string = localStorage.getItem('accessToken');
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'my-auth-token'
      })
    };
    httpOptions.headers.set('Authorization', `Bearer ${accessToken}`);
    httpOptions.headers.append('Content-Type', 'multipart/form-data');
    return this.http.post<any>(environment.backendLink + 'econews/uploadImages', formData, httpOptions);
  }
}
