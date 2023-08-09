import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HabitsGalleryViewComponent } from './habits-gallery-view.component';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Observable, of } from 'rxjs';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { DEFAULTHABIT } from '@global-user/components/habit/mocks/habit-assigned-mock';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { DEFAULTFULLINFOHABIT } from '@global-user/components/habit/mocks/habit-assigned-mock';
import { HabitAssignPropertiesDto } from '@global-models/goal/HabitAssignCustomPropertiesDto';

describe('HabitsGalleryViewComponent', () => {
  let component: HabitsGalleryViewComponent;
  let fixture: ComponentFixture<HabitsGalleryViewComponent>;
  let matSnackBarMock: MatSnackBarComponent;
  matSnackBarMock = jasmine.createSpyObj('MatSnackBarComponent', ['openSnackBar']);
  matSnackBarMock.openSnackBar = (type: string) => {};
  let httpTestingController: HttpTestingController;
  let habitAssignServiceMock: HabitAssignService;
  habitAssignServiceMock = jasmine.createSpyObj('HabitAssignService', ['assignHabit']);
  habitAssignServiceMock.assignHabit = () => new Observable();

  let fakeHabitAssignService: HabitAssignService;
  fakeHabitAssignService = jasmine.createSpyObj('fakeHabitAssignService', ['assignCustomHabit', 'assignHabit']);
  fakeHabitAssignService.assignCustomHabit = () => of();
  fakeHabitAssignService.assignHabit = () => of();

  const localStorageServiceMock = jasmine.createSpyObj('localeStorageService', ['getUserId']);
  localStorageServiceMock.getUserId = () => 1;

  const mockActivatedRoute = {
    params: of({ habitId: 2 })
  };

  const routerMock: Router = jasmine.createSpyObj('router', ['navigate']);

  const defaultImagePath =
    'https://csb10032000a548f571.blob.core.windows.net/allfiles/90370622-3311-4ff1-9462-20cc98a64d1ddefault_image.jpg';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HabitsGalleryViewComponent],
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
    httpTestingController = TestBed.inject(HttpTestingController);
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

  it('should set userId on onInit', () => {
    (component as any).userId = 12;
    component.ngOnInit();
    expect((component as any).userId).toBe(1);
  });

  it('should call go to profile and snackbar on afterHabitWasChanged', () => {
    (component as any).userId = 2;
    const spySnackBar = spyOn(matSnackBarMock, 'openSnackBar');
    (component as any).afterHabitWasChanged();
    expect(routerMock.navigate).toHaveBeenCalledWith(['profile', 2]);
    expect(spySnackBar).toHaveBeenCalledWith('habitAdded');
  });

  it('addHabit method should call assignCustomHabit methods', () => {
    (component as any).habit.isCustomHabit = true;
    const spy = spyOn(component as any, 'assignCustomHabit');
    component.addHabit();
    expect(spy).toHaveBeenCalled();
  });

  it('addHabit method should call assignStandartHabit methods', () => {
    (component as any).habit.isCustomHabit = false;
    const spy = spyOn(component as any, 'assignStandartHabit');
    component.addHabit();
    expect(spy).toHaveBeenCalled();
  });

  it('call of assignCustomHabit method should invoke afterHabitWasChanged method', () => {
    const spy = spyOn(component as any, 'afterHabitWasChanged');
    const habitAssignPropertiesDto: HabitAssignPropertiesDto = { duration: 25, defaultShoppingListItems: [] };
    const friendsIdsList = [];
    (component as any).assignCustomHabit();
    fakeHabitAssignService
      .assignCustomHabit(1, friendsIdsList, habitAssignPropertiesDto)
      .pipe(take(1))
      .subscribe(() => {
        expect(spy).toHaveBeenCalled();
      });
  });

  it('call of assignStandartHabit method should invoke afterHabitWasChanged method', () => {
    const spy = spyOn(component as any, 'afterHabitWasChanged');
    (component as any).habit.id = 2;
    (component as any).assignStandartHabit();
    fakeHabitAssignService
      .assignHabit((component as any).habitId)
      .pipe(take(1))
      .subscribe(() => {
        expect(spy).toHaveBeenCalled();
      });
  });
});
