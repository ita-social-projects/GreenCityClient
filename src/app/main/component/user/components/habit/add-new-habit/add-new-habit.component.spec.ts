import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AddNewHabitComponent } from './add-new-habit.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { ShoppingListService } from './habit-edit-shopping-list/shopping-list.service';
import { HabitService } from '@global-service/habit/habit.service';
import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { of, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HabitResponseInterface } from 'src/app/main/interface/habit/habit-assign.interface';

fdescribe('AddNewHabitComponent', () => {
  let component: AddNewHabitComponent;
  let fixture: ComponentFixture<AddNewHabitComponent>;
  let matSnackBarMock: MatSnackBarComponent;
  let fakeHabitAssignService: HabitAssignService;
  let fakeLocalStorageService: LocalStorageService;
  const mockHabitResponse: HabitResponseInterface = {
    complexity: 2,
    defaultDuration: 2,
    habitTranslation: {
      description: 'test',
      habitItem: 'test',
      languageCode: 'test',
      name: 'test'
    },
    id: 2,
    image: 'test',
    shoppingListItems: []
  };
  const mockActivatedRoute = {
    params: of({ habitId: 2 })
  };
  fakeHabitAssignService = jasmine.createSpyObj('fakeHabitAssignService', {
    getAssignedHabits: of([
      {
        habit: {
          id: 2
        }
      }
    ]),
    deleteHabitById: of('test'),
    getCustomHabit: of(mockHabitResponse),
    getHabitById: of(mockHabitResponse)
  });
  fakeLocalStorageService = jasmine.createSpyObj('fakeLocalStorageService', {
    getCurrentLanguage: () => 'ua'
  });
  fakeLocalStorageService.languageSubject = new Subject();
  fakeLocalStorageService.languageSubject.next('ua');
  matSnackBarMock = jasmine.createSpyObj('MatSnackBarComponent', ['openSnackBar']);
  matSnackBarMock.openSnackBar = (type: string) => {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewHabitComponent],
      imports: [RouterTestingModule, HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: MatSnackBarComponent, useValue: matSnackBarMock },
        { provide: HabitService, useValue: {} },
        { provide: HabitAssignService, useValue: fakeHabitAssignService },
        { provide: ShoppingListService, useValue: {} },
        { provide: LocalStorageService, useValue: fakeLocalStorageService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewHabitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('method deleteHabbit should navigate and openSnackBar', (done) => {
    const mockId = 33;
    // @ts-ignore
    spyOn(component.snackBar, 'openSnackBar').and.returnValue();
    fakeHabitAssignService.deleteHabitById(mockId).subscribe(() => {
      // @ts-ignore
      expect(component.snackBar.openSnackBar).toHaveBeenCalledWith('habitDeleted2');
      done();
    });
    component.deleteHabit();
  });

  it('ngOnDestroy should unsubscribe from subscription', () => {
    // @ts-ignore
    spyOn(component.langChangeSub, 'unsubscribe');
    component.ngOnDestroy();
    // @ts-ignore
    expect(component.langChangeSub.unsubscribe).toHaveBeenCalled();
  });
});
