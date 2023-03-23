import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { habitLink } from '../../links';
import { HabitInterface, HabitListInterface } from '../../interface/habit/habit.interface';
import { ShoppingList } from '../../component/user/models/shoppinglist.model';
import { TagInterface } from '@shared/components/tag-filter/tag-filter.model';
import { environment } from '@environment/environment';
import { CustomHabitInterface } from '../../interface/habit/custom-habit.interface';

@Injectable({
  providedIn: 'root'
})
export class HabitService implements OnDestroy {
  language: string;
  destroy$: ReplaySubject<any> = new ReplaySubject<any>(1);
  private tagsType = 'HABIT';
  private backEnd = environment.backendLink;

  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {
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

  public getAllTags(): Observable<Array<TagInterface>> {
    return this.http.get<Array<TagInterface>>(`${this.backEnd}tags/v2/search?type=${this.tagsType}`);
  }

  getHabitsByTagAndLang(page: number, size: number, tags: Array<string>, sort: string = 'asc'): Observable<HabitListInterface> {
    return this.http.get<HabitListInterface>(
      `${habitLink}/tags/search?lang=${this.language}&page=${page}&size=${size}&sort=${sort}&tags=${tags}`
    );
  }

  addCustomHabit(habit: any, lang): Observable<object> {
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
      image: habit.image,
      tags: habit.tags,
      customShoppingListItemDto: habit.shopList
    };
    return this.http.post<object>(`${habitLink}/custom`, body);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
