import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileDashboardComponent } from './profile-dashboard.component';

import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { EventsService } from 'src/app/main/component/events/services/events.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { take } from 'rxjs/operators';
import { EventResponseDto } from 'src/app/main/component/events/models/events.interface';

describe('ProfileDashboardComponent', () => {
  let component: ProfileDashboardComponent;
  let fixture: ComponentFixture<ProfileDashboardComponent>;

  const HabitAssignServiceMock = jasmine.createSpyObj('habitAssignService', ['getAssignedHabits']);
  HabitAssignServiceMock.getAssignedHabits = () => of([{ id: 1 }]);

  const LocalStorageServiceMock = jasmine.createSpyObj('localStorageService', ['getUserId', 'languageBehaviourSubject', 'setCurentPage']);
  LocalStorageServiceMock.languageBehaviourSubject = new BehaviorSubject('ua');

  const storeMock = jasmine.createSpyObj('store', ['select', 'dispatch']);
  storeMock.select = () => of({ ecoNews: {}, autorNews: [{ newsId: 1 }], pageNumber: 1, error: 'error', ecoNewsByAuthor: true });

  const MockHabits = {
    id: 1,
    status: 'INPROGRESS',
    userId: 10,
    duration: 20,
    workingDays: 2,
    habitStreak: 10
  };

  const MockRequest = {
    page: [],
    totalElements: 4
  };

  const EventsServiceMock = jasmine.createSpyObj('EventsService', ['getCreatedEvents', 'getUsersEvents']);
  EventsServiceMock.getCreatedEvents = () => of(MockRequest);
  EventsServiceMock.getUsersEvents = () => of(MockRequest);

  const MockResult: EventResponseDto = {
    currentPage: 0,
    first: true,
    hasNext: false,
    hasPrevious: false,
    last: false,
    number: 0,
    page: [
      {
        additionalImages: [],
        dates: [
          {
            coordinates: {
              addressEn: 'first',
              addressUa: 'second',
              latitude: 1,
              longitude: 1
            },
            event: 'event',
            finishDate: '2022-06-29T04:00:00Z',
            id: 1,
            onlineLink: 'http',
            startDate: '2022-06-29T04:00:00Z'
          }
        ],
        description: 'description',
        id: 95,
        open: true,
        organizer: {
          id: 12,
          name: 'username',
          organizerRating: 2
        },
        tags: [
          {
            id: 1,
            nameUa: 'Укр тег',
            nameEn: 'Eng Tag'
          }
        ],
        title: 'title',
        titleImage: 'image title',
        isSubscribed: true
      }
    ],
    totalElements: 12,
    totalPages: 1
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileDashboardComponent],
      imports: [TranslateModule.forRoot(), RouterTestingModule, InfiniteScrollModule, NgxPaginationModule],
      providers: [
        { provide: HabitAssignService, useValue: HabitAssignServiceMock },
        { provide: Store, useValue: storeMock },
        { provide: LocalStorageService, useValue: LocalStorageServiceMock },
        { provide: EventsService, useValue: EventsServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onInit should call five method', () => {
    const spy1 = spyOn(component as any, 'subscribeToLangChange');
    const spy2 = spyOn(component as any, 'getUserId');
    const spy3 = spyOn(component, 'dispatchNews');
    const spy4 = spyOn(component, 'initGetUserEvents');

    component.ngOnInit();

    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(spy3).toHaveBeenCalledTimes(1);
    expect(spy4).toHaveBeenCalledTimes(1);
    expect(LocalStorageServiceMock.setCurentPage).toHaveBeenCalledWith('previousPage', '/profile');
  });

  it('onInit news should have expected result', () => {
    component.ngOnInit();
    component.authorNews$.subscribe((item: any) => {
      expect(component.news[0]).toEqual({ newsId: 1 } as any);
    });
  });

  it('Should call getCreatedEvents method and return MockResult', async(() => {
    spyOn(EventsServiceMock, 'getCreatedEvents').and.returnValue(of(MockResult));
    component.initGetUserEvents();
    EventsServiceMock.getCreatedEvents(0, 100).subscribe((event: any) => {
      expect(event).toEqual(MockResult);
    });
  }));

  it('dispatchNews expect store.dispatch have been called', () => {
    (component as any).currentPage = 1;
    (component as any).hasNext = true;
    component.dispatchNews(false);
    expect((component as any).store.dispatch).toHaveBeenCalledTimes(1);
  });

  it('changeStatus should return right Id', () => {
    HabitAssignServiceMock.habitsInProgress = [{ id: 4 }, { id: 2 }];
    component.changeStatus({ id: 4 } as any);
    expect(HabitAssignServiceMock.habitsInProgress).toEqual([{ id: 2 }] as any);
  });

  it('getUserId expect userId shoud be 2', () => {
    LocalStorageServiceMock.getUserId = () => 2;
    (component as any).getUserId();
    expect(component.userId).toBe(2);
  });

  it('executeRequests habitsInProgress.duration to be 20', () => {
    MockHabits.status = 'INPROGRESS';
    HabitAssignServiceMock.getAssignedHabits = () => of([MockHabits]);
    component.executeRequests();
    expect(HabitAssignServiceMock.habitsInProgress[0].duration).toBe(20);
  });

  it('executeRequests habitsAcquired to be 2', () => {
    const spy = spyOn(component, 'setHabitsForView');
    MockHabits.status = 'ACQUIRED';
    HabitAssignServiceMock.getAssignedHabits = () => of([MockHabits]);
    component.executeRequests();

    expect(component.habitsAcquired[0].workingDays).toBe(2);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('setHabitsForView should return array length', () => {
    component.numberOfHabitsOnView = 2;
    HabitAssignServiceMock.habitsInProgress = [1, 2, 3];
    component.habitsAcquired = [1, 2, 3, 4] as any;
    component.setHabitsForView();
    expect(HabitAssignServiceMock.habitsInProgressToView.length).toBe(2);
    expect(component.habitsAcquiredToView.length).toBe(2);
  });

  it('getMoreHabitsInProgressForView expect habitsInProgressToView get new value', () => {
    spyOn(component, 'getMoreHabits').and.returnValue(['array'] as any);
    component.getMoreHabitsInProgressForView();
    expect(HabitAssignServiceMock.habitsInProgressToView).toEqual(['array']);
  });

  it('getMoreHabitsAcquiredForView habitsAcquiredToView should change lenght', () => {
    spyOn(component, 'getMoreHabits').and.returnValue(['array', 'tho'] as any);
    component.getMoreHabitsAcquiredForView();
    expect(component.habitsAcquiredToView.length).toBe(2);
  });

  it('getMoreHabits should return HABIT', () => {
    component.numberOfHabitsOnView = 3;
    const res = component.getMoreHabits(['H', 'A'] as any, [1, 2, 'B', 'I', 'T'] as any);
    expect(res.join('')).toEqual('HABIT');
  });

  it('sortHabitsAsc', () => {
    const res = (component as any).sortHabitsAsc([{ habit: { id: 2 } }, { habit: { id: 4 } }, { habit: { id: 1 } }]);
    expect(res[0].habit.id).toBe(1);
  });

  it('tabChanged', () => {
    component.isActiveInfinityScroll = false;
    component.tabChanged({ index: 1, tab: {} as any });
    expect(component.isActiveInfinityScroll).toBe(true);
  });

  it('onScroll', () => {
    const spy = spyOn(component, 'dispatchNews');
    component.onScroll();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
