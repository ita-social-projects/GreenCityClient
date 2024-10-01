import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HabitsGalleryViewComponent } from './habits-gallery-view.component';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Observable, of } from 'rxjs';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { DEFAULTHABIT } from '@global-user/components/habit/mocks/habit-assigned-mock';
import { ActivatedRoute, Router } from '@angular/router';
import { LangValueDirective } from 'src/app/shared/directives/lang-value/lang-value.directive';
import { HabitStatus } from '@global-models/habit/HabitStatus.enum';

describe('HabitsGalleryViewComponent', () => {
  let component: HabitsGalleryViewComponent;
  let fixture: ComponentFixture<HabitsGalleryViewComponent>;
  const matSnackBarMock: MatSnackBarComponent = jasmine.createSpyObj('MatSnackBarComponent', ['openSnackBar']);
  const habitAssignServiceMock: HabitAssignService = jasmine.createSpyObj('HabitAssignService', ['assignHabit']);
  habitAssignServiceMock.assignHabit = () => new Observable();

  const fakeHabitAssignService: HabitAssignService = jasmine.createSpyObj('fakeHabitAssignService', ['assignCustomHabit', 'assignHabit']);
  fakeHabitAssignService.assignCustomHabit = () => of();
  fakeHabitAssignService.assignHabit = () => of();

  const localStorageServiceMock = jasmine.createSpyObj('localeStorageService', ['getUserId', 'getCurrentLanguage']);
  localStorageServiceMock.getUserId = () => 1;

  const mockActivatedRoute = {
    params: of({ habitId: 2 })
  };

  const mockHabit = {
    id: 1,
    status: 'Active' as HabitStatus,
    createDateTime: new Date(),
    habit: 2,
    userId: 2,
    duration: 30,
    workingDays: 5,
    habitStreak: 1,
    lastEnrollmentDate: new Date()
  };

  const routerMock: Router = jasmine.createSpyObj('router', ['navigate']);

  const defaultImagePath =
    'https://csb10032000a548f571.blob.core.windows.net/allfiles/90370622-3311-4ff1-9462-20cc98a64d1ddefault_image.jpg';

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HabitsGalleryViewComponent, LangValueDirective],
      imports: [TranslateModule.forRoot(), RouterTestingModule, MatSnackBarModule, HttpClientTestingModule],
      providers: [
        { provide: MatSnackBarComponent, useValue: matSnackBarMock },
        { provide: HabitAssignService, useValue: habitAssignServiceMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: routerMock },
        { provide: HabitAssignService, useValue: fakeHabitAssignService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HabitsGalleryViewComponent);
    component = fixture.componentInstance;
    component.habit = DEFAULTHABIT;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call method getStars on onInit', () => {
    const spy = spyOn(component, 'getStars');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should update stars array with green stars up to complexity level', () => {
    component.getStars(2);
    expect(component.stars).toEqual([component.greenStar, component.greenStar, component.whiteStar]);
  });

  it('should update stars array with all green stars if complexity is equal to or greater than stars length', () => {
    component.getStars(5);
    expect(component.stars).toEqual([component.greenStar, component.greenStar, component.greenStar]);
  });

  it('should update stars based on complexity', () => {
    component.getStars(2);
    expect(component.stars).toEqual([component.greenStar, component.greenStar, component.whiteStar]);
    component.getStars(1);
    expect(component.stars).toEqual([component.greenStar, component.whiteStar, component.whiteStar]);
    component.getStars(3);
    expect(component.stars).toEqual([component.greenStar, component.greenStar, component.greenStar]);
  });
});
