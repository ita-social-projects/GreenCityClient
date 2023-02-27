import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HabitsGalleryViewComponent } from './habits-gallery-view.component';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Observable } from 'rxjs';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';

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

  const localeStorageServiceMock = jasmine.createSpyObj('localeStorageService', ['getUserId']);
  localeStorageServiceMock.getUserId = () => 1;

  const defaultImagePath =
    'https://csb10032000a548f571.blob.core.windows.net/allfiles/90370622-3311-4ff1-9462-20cc98a64d1ddefault_image.jpg';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HabitsGalleryViewComponent],
      imports: [TranslateModule.forRoot(), RouterTestingModule, MatSnackBarModule, HttpClientTestingModule],
      providers: [
        { provide: MatSnackBarComponent, useValue: MatSnackBarMock },
        { provide: HabitAssignService, useValue: habitAssignServiceMock },
        { provide: LocalStorageService, useValue: localeStorageServiceMock }
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
      image: defaultImagePath,
      tags: ['test1', 'test2']
    };
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

  it('should call open SnackBar', () => {
    const spy = spyOn(component.router, 'navigate');
    component.goHabitMore();
    expect(spy).toHaveBeenCalled();
  });
});
