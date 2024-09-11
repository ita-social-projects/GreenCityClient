import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { habitLink } from '../../links';
import { TagInterface } from '@shared/components/tag-filter/tag-filter.model';
import { environment } from '@environment/environment';
import { HabitInterface, HabitListInterface } from '@global-user/components/habit/models/interfaces/habit.interface';
import { ShoppingList } from '@global-user/models/shoppinglist.interface';
import { CustomHabitDtoRequest, CustomHabit, HabitPageable } from '@global-user/components/habit/models/interfaces/custom-habit.interface';
import { FriendProfilePicturesArrayModel } from '@global-user/models/friend.model';
import { FileHandle } from '@eco-news-models/create-news-interface';

@Injectable({
  providedIn: 'root'
})
export class HabitService {
  language: string;
  destroy$: ReplaySubject<any> = new ReplaySubject<any>(1);
  imageFile: FileHandle = null;
  private tagsType = 'HABIT';
  private backEnd = environment.backendLink;
  private httpOptions = {
    headers: new HttpHeaders({
      Authorization: 'my-auth-token'
    })
  };

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    localStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroy$)).subscribe((language) => (this.language = language));
  }

  getAllHabits(page: number, size: number): Observable<HabitListInterface> {
    return this.http.get<HabitListInterface>(`${habitLink}?lang=${this.language}&page=${page}&size=${size}`);
  }

  getHabitById(id: number): Observable<HabitInterface> {
    return this.http.get<HabitInterface>(`${habitLink}/${id}?lang=${this.language}`);
  }

  getHabitShoppingList(id: number): Observable<Array<ShoppingList>> {
    return this.http.get<Array<ShoppingList>>(`${habitLink}/${id}/shopping-list?lang=${this.language}`);
  }

  getAllTags(): Observable<Array<TagInterface>> {
    return this.http.get<Array<TagInterface>>(`${this.backEnd}tags/v2/search?type=${this.tagsType}`);
  }

  getHabitsByFilters(criteria: HabitPageable): Observable<HabitListInterface> {
    const params = this.getHttpParams(criteria);
    return this.http.get<HabitListInterface>(`${habitLink}/search?${params}`);
  }

  addCustomHabit(habit: CustomHabit, lang: string): Observable<CustomHabitDtoRequest> {
    const formData = this.prepareCustomHabitRequest(habit, lang);
    return this.http.post<CustomHabitDtoRequest>(`${habitLink}/custom`, formData, this.httpOptions);
  }

  changeCustomHabit(habit: CustomHabit, lang: string, id: number): Observable<CustomHabitDtoRequest> {
    const formData = this.prepareCustomHabitRequest(habit, lang);
    return this.http.put<CustomHabitDtoRequest>(`${habitLink}/update/${id}`, formData, this.httpOptions);
  }

  getFriendsTrakingSameHabitByHabitId(id: number): Observable<FriendProfilePicturesArrayModel[]> {
    return this.http.get<FriendProfilePicturesArrayModel[]>(`${habitLink}/${id}/friends/profile-pictures`);
  }

  deleteCustomHabit(id: number): Observable<CustomHabitDtoRequest> {
    return this.http.delete<CustomHabitDtoRequest>(`${habitLink}/delete/${id}`);
  }

  private getHttpParams(criteria: HabitPageable): string {
    let params = new HttpParams();
    params = criteria.lang ? params.set('lang', criteria.lang) : params.set('lang', this.language);
    params = criteria.page ? params.set('page', criteria.page.toString()) : params.set('page', '0');
    params = criteria.size ? params.set('size', criteria.size.toString()) : params.set('size', '6');
    params = criteria.sort ? params.set('sort', criteria.sort) : params.set('sort', 'asc');

    if (criteria.excludeAssigned !== undefined) {
      params = params.set('excludeAssigned', criteria.excludeAssigned.toString());
    }

    if (criteria.filters && Array.isArray(criteria.filters)) {
      let isCustomHabitFilter: string | null = null;
      let complexitiesFilter: string | null = null;
      let tagsFilter: string | null = null;

      criteria.filters.forEach((filter) => {
        const parts = filter.split(',');
        parts.forEach((part) => {
          if (part.startsWith('isCustomHabit=')) {
            isCustomHabitFilter = part;
          } else if (part.startsWith('complexities=')) {
            complexitiesFilter = part;
          } else if (part.startsWith('tags=')) {
            tagsFilter = part;
          }
        });
      });
      if (isCustomHabitFilter) {
        const [key, value] = isCustomHabitFilter.split('=');
        params = params.set(key, value);
      }
      if (complexitiesFilter) {
        const [key, value] = complexitiesFilter.split('=');
        params = params.set(key, value);
      }
      if (tagsFilter) {
        const [key, value] = tagsFilter.split('=');
        params = params.set(key, value);
      }
    }
    if (criteria.tags && Array.isArray(criteria.tags) && criteria.tags.length > 0) {
      const tags = criteria.tags.join(',');
      params = params.set('tags', tags);
    }

    return params.toString().replace(/%252C/g, ',');
  }

  private prepareCustomHabitRequest(habit: CustomHabit, lang: string): FormData {
    const body = {
      habitTranslations: [
        {
          name: habit.title,
          description: habit.description,
          habitItem: '',
          languageCode: lang
        }
      ],
      complexity: habit.complexity,
      defaultDuration: habit.duration,
      tagIds: habit.tagIds,
      customShoppingListItemDto: habit.shopList
    };

    const formData = new FormData();
    formData.append('request', JSON.stringify(body));
    if (this.imageFile) {
      formData.append('image', this.imageFile.file);
      this.imageFile = null;
    }

    const accessToken = this.localStorageService.getAccessToken();
    this.httpOptions.headers.set('Authorization', `Bearer ${accessToken}`);
    this.httpOptions.headers.append('Content-Type', 'multipart/form-data');

    return formData;
  }
}
