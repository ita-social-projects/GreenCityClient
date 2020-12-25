import { RouterTestingModule } from '@angular/router/testing';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedModule } from '../../../../shared/shared.module';
import { HabitsListViewComponent } from './components/habits-list-view/habits-list-view.component';
import { HabitsGalleryViewComponent } from '../../shared/components/habits-gallery-view/habits-gallery-view.component';
import { LocalStorageService } from '../../../../../service/localstorage/local-storage.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

import { AllHabitsComponent } from './all-habits.component';
import { AllHabitsService } from './services/all-habits.service';
import { ServerHabitItemPageModel } from '@global-user/models/habit-item.model';

describe('AllHabitsComponent', () => {
  let component: AllHabitsComponent;
  let fixture: ComponentFixture<AllHabitsComponent>;

  const habitsMockData: ServerHabitItemPageModel[] = [{
      habitTranslation: {
        description: 'test',
        habitItem: ['test'],
        languageCode: 'test',
        name: 'test'
      },
      id: 0,
      image: 'test',
      defaultDuration: 1
    },
    {
      habitTranslation: {
        description: 'test2',
        habitItem: ['test2'],
        languageCode: 'test2',
        name: 'test2'
      },
      id: 1,
      image: 'test',
      defaultDuration: 1
    }
  ];

  const mockData = new BehaviorSubject<any>({
    currentPage: 0,
    page: habitsMockData,
    totalElements: 2,
    totalPages: 1
  });

  const allHabitsServiceMock = jasmine.createSpyObj('AllHabitsService', ['allHabits', 'fetchAllHabits', 'resetSubject']);
  allHabitsServiceMock.allHabits = mockData;
  allHabitsServiceMock.fetchAllHabits = (page, batchSize, lang) => true;
  allHabitsServiceMock.resetSubject = () => true;

  const localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['languageBehaviourSubject']);
  localStorageServiceMock.languageBehaviourSubject = new BehaviorSubject<string>('en');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AllHabitsComponent,
        HabitsListViewComponent,
       ],
      imports: [
        TranslateModule.forRoot(),
        SharedModule,
        InfiniteScrollModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AllHabitsService, useValue: allHabitsServiceMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllHabitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    allHabitsServiceMock.languageBehaviourSubject = new BehaviorSubject<string>('en');
    expect(component).toBeTruthy();
  });

  describe('Test main functionality', () => {
    it('Should change view mode', () => {
      component.onDisplayModeChange(false);
      expect(component.galleryView).toBeFalsy();
    });

    it('Should filter data by array of tags', () => {
      // @ts-ignore
      component.habitsList = habitsMockData;
      component.getFilterData(['test']);

      expect(component.filteredHabitsList).toEqual([habitsMockData[0]]);
    });

    it('Should stop fetching data on scroll if there is no page left', () => {
      component.isFetching = true;
      // @ts-ignore
      component.totalPages = 1;
      // @ts-ignore
      component.currentPage = 1;
      component.onScroll();
      expect(component.isFetching).toEqual(false);
    });

    it('Should stop fetching data on scroll if there is no page left', () => {
      // @ts-ignore
      const spy = spyOn(component, 'getAllHabits').and.returnValue(true);
      // @ts-ignore
      component.totalPages = 2;
      // @ts-ignore
      component.currentPage = 1;
      // @ts-ignore
      component.lang = 'en';
      component.onScroll();
      expect(spy).toHaveBeenCalledWith(2, 6, 'en');
    });
  });
});
