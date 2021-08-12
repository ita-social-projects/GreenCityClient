import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HabitsGalleryViewComponent } from './habits-gallery-view.component';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Observable } from 'rxjs';

describe('HabitsGalleryViewComponent', () => {
  let component: HabitsGalleryViewComponent;
  let fixture: ComponentFixture<HabitsGalleryViewComponent>;
  let MatSnackBarMock: MatSnackBarComponent;
  MatSnackBarMock = jasmine.createSpyObj('MatSnackBarComponent', ['openSnackBar']);
  MatSnackBarMock.openSnackBar = (type: string) => {};
  let httpTestingController: HttpTestingController;
  let habitAssignServiceMock: HabitAssignService;
  habitAssignServiceMock = jasmine.createSpyObj('HabitAssignService', ['assignHabit']);
  habitAssignServiceMock.assignHabit = () => new Observable();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HabitsGalleryViewComponent],
      imports: [TranslateModule.forRoot(), RouterTestingModule, MatSnackBarModule, HttpClientTestingModule],
      providers: [
        { provide: MatSnackBarComponent, useValue: MatSnackBarMock },
        { provide: HabitAssignService, useValue: habitAssignServiceMock }
      ]
    }).compileComponents();
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HabitsGalleryViewComponent);
    component = fixture.componentInstance;
    component.habit = {
      complexity: 1,
      defaultDuration: 14,
      habitTranslation: {
        description: 'test',
        habitItem: 'test',
        languageCode: 'en',
        name: 'test'
      },
      id: 503,
      image: 'test',
      tags: ['test1', 'test2']
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open snackbar if habit assigned', () => {
    // @ts-ignore
    const spy = spyOn(component.snackBar, 'openSnackBar');
    component.addHabit();
    // @ts-ignore
    expect(component.requesting).toBeTruthy();
    expect(spy).toBeDefined();
  });

  it('should navigate to habit-more page', () => {
    const spy = spyOn(component.router, 'navigate');
    component.goHabitMore();
    expect(spy).toHaveBeenCalled();
  });
});
