import { SharedMainModule } from '@shared/shared-main.module';
import { HabitAssignInterface } from './../../../../../interface/habit/habit-assign.interface';
import { HabitAssignService } from './../../../../../service/habit-assign/habit-assign.service';
import { RouterTestingModule } from '@angular/router/testing';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { HabitsListViewComponent } from './components/habits-list-view/habits-list-view.component';
import { LocalStorageService } from '../../../../../service/localstorage/local-storage.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, of } from 'rxjs';

import { AllHabitsComponent } from './all-habits.component';
import { HabitService } from '../../../../../service/habit/habit.service';
import { HabitListInterface } from '../../../../../interface/habit/habit.interface';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AllHabitsComponent', async () => {
  let component: AllHabitsComponent;
  let fixture: ComponentFixture<AllHabitsComponent>;

  const assignedHabitsMock: Array<HabitAssignInterface> = [
    {
      createDateTime: new Date('2021-02-11T16:35:18.048839Z'),
      duration: 14,
      habit: {
        defaultDuration: 14,
        habitTranslation: {
          description: 'Test',
          habitItem: 'Test',
          languageCode: 'en',
          name: 'Test'
        },
        id: 506,
        image: '',
        tags: []
      },
      habitStatusCalendarDtoList: [],
      habitStreak: 0,
      id: 154,
      lastEnrollmentDate: new Date('2021-02-11T16:35:18.04885Z'),
      status: 'INPROGRESS',
      userId: 7835,
      workingDays: 0,
      shoppingListItems: []
    }
  ];

  const habitsMockData: HabitListInterface = {
    currentPage: 1,
    page: [
      {
        defaultDuration: 1,
        habitTranslation: {
          description: 'test',
          habitItem: 'test, best',
          languageCode: 'en',
          name: 'test'
        },
        id: 0,
        image: 'test',
        tags: ['test']
      },
      {
        defaultDuration: 1,
        habitTranslation: {
          description: 'test2',
          habitItem: 'test2',
          languageCode: 'en',
          name: 'test2'
        },
        id: 1,
        image: 'test2',
        tags: ['test2']
      }
    ],
    totalElements: 2,
    totalPages: 1
  };

  const mockData = new BehaviorSubject<any>(habitsMockData);

  const localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['languageBehaviourSubject']);
  localStorageServiceMock.languageBehaviourSubject = new BehaviorSubject<string>('en');
  const assignHabitServiceMock: HabitAssignService = TestBed.get(HabitAssignService);
  assignHabitServiceMock.getAssignedHabits = () => of(assignedHabitsMock);

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllHabitsComponent, HabitsListViewComponent],
      imports: [TranslateModule.forRoot(), SharedMainModule, InfiniteScrollModule, RouterTestingModule, HttpClientTestingModule],
      providers: [HabitService, HabitAssignService, { provide: LocalStorageService, useValue: localStorageServiceMock }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllHabitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.allHabits = mockData;
    component.resetSubject = () => true;
    const habitServiceMock: HabitService = TestBed.get(HabitService);
    habitServiceMock.getAllHabits = () => of(habitsMockData);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Test main functionality', () => {
    it('Should change view mode', () => {
      component.onDisplayModeChange(false);
      expect(component.galleryView).toBeFalsy();
    });

    it('Should filter data by array of tags', () => {
      const data = component[`splitHabitItems`](habitsMockData);
      component.filteredHabitsList = data.page;
      component[`habitsList`] = data.page;
      component.getFilterData(['test']);

      expect(component.filteredHabitsList).toEqual([habitsMockData.page[0]]);
    });

    it('Should stop fetching data on scroll if there is no page left', () => {
      component.isFetching = true;
      // @ts-ignore
      component.totalPages = 2;
      // @ts-ignore
      component.currentPage = 2;
      component.onScroll();
      expect(component.isFetching).toEqual(false);
    });

    it('Should stop fetching data on scroll if there is no page left', () => {
      // @ts-ignore
      const spy = spyOn(component, 'fetchAllHabits').and.returnValue(true);
      // @ts-ignore
      component.totalPages = 2;
      // @ts-ignore
      component.currentPage = 1;
      // @ts-ignore
      component.lang = 'en';
      component.onScroll();
      expect(spy).toHaveBeenCalledWith(2, 6);
    });
  });
});
