import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { HabitsWidgetComponent } from './habits-widget.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HabitService } from '@global-service/habit/habit.service';
import { HabitListInterface } from 'src/app/main/interface/habit/habit.interface';
import { of } from 'rxjs';
import { EcoNewsService } from '@eco-news-service/eco-news.service';
import { EcoNewsDto } from '@eco-news-models/eco-news-dto';
import { EcoNewsModel } from '@eco-news-models/eco-news-model';

describe('HabitsWidgetComponent', () => {
  let component: HabitsWidgetComponent;
  let fixture: ComponentFixture<HabitsWidgetComponent>;

  const HabitMock: HabitListInterface = {
    currentPage: 3,
    page: [
      {
        defaultDuration: 14,
        habitTranslation: {
          description: 'test',
          habitItem: 'test',
          languageCode: 'ua',
          name: 'test'
        },
        id: 2,
        image: 'image',
        isAssigned: true,
        complexity: 2,
        shoppingListItems: [],
        tags: ['test']
      }
    ],
    totalElements: 3,
    totalPages: 1
  };

  const NewsMock: EcoNewsDto = {
    page: [
      {
        countComments: 2,
        id: 1,
        imagePath: 'defaultImagePath',
        title: 'string',
        content: 'string',
        author: {
          id: 1,
          name: 'string'
        },
        tags: ['test'],
        tagsEn: ['test'],
        tagsUa: ['test'],
        creationDate: '11',
        likes: 0,
        shortInfo: 'info',
        source: null
      }
    ],
    totalElements: 3,
    currentPage: 1,
    totalPages: 1,
    hasNext: false
  };

  const habitServiceMock: HabitService = jasmine.createSpyObj('habitService', ['getHabitsByTagAndLang']);
  habitServiceMock.getHabitsByTagAndLang = () => of(HabitMock);

  const newsSeviseMock: EcoNewsService = jasmine.createSpyObj('habitService', ['getEcoNewsListByPage']);
  newsSeviseMock.getEcoNewsListByPage = () => of(NewsMock);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HabitsWidgetComponent],
      imports: [RouterTestingModule, HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: HabitService, useValue: habitServiceMock },
        { provide: EcoNewsService, useValue: newsSeviseMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HabitsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call two methods on ngAfterViewInit', () => {
    const spy1 = spyOn(component as any, 'getRecommendedHabits');
    const spy2 = spyOn(component as any, 'getRecommendedNews');
    component.ngAfterViewInit();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });
});
