import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AddNewHabitComponent } from './add-new-habit.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { ShoppingListService } from './habit-edit-shopping-list/shopping-list.service';
import { HabitService } from '@global-service/habit/habit.service';
import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { of, Subject, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('AddNewHabitComponent', () => {
  let component: AddNewHabitComponent;
  let fixture: ComponentFixture<AddNewHabitComponent>;
  let matSnackBarMock: MatSnackBarComponent;
  let fakeHabitAssignService: HabitAssignService;
  let fakeLocalStorageService: LocalStorageService;
  const mockActivatedRoute = {
    params: of({ habitId: 2 })
    // params: {
    //   subscribe: of({ habitId: 2 })
    // }
  };
  fakeHabitAssignService = jasmine.createSpyObj('MatSnackBarComponent', {
    getAssignedHabits: of('mock data')
  });
  fakeLocalStorageService = jasmine.createSpyObj('MatSnackBarComponent', {
    getCurrentLanguage: () => 'ua'
    // 'languageSubject': of('ua')
  });
  fakeLocalStorageService.languageSubject = new Subject();
  // fakeLocalStorageService.languageSubject = of({'ua'});
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
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewHabitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // spyOn(component, 'checkIfAssigned').and.callFake(() => {});
    // // @ts-ignore
    // spyOn(component, 'getUserId').and.callFake(() => {});
    // // @ts-ignore
    // spyOn(component, 'bindLang').and.callFake(() => {});
    // // @ts-ignore
    // spyOn(component, 'subscribeToLangChange').and.callFake(() => {});
    spyOn(component, 'ngOnInit').and.callFake(() => {});
    expect(component).toBeTruthy();
  });

  // it('ngOnDestroy should unsubscribe from subscription', () => {
  //   // @ts-ignore
  //   // const spy = (component.langChangeSub, 'unsubscribe');
  //   const spy = (Subscription.prototype, 'unsubscribe');
  //   // component.langChangeSub = new Subscription();
  //   // fixture.detectChanges();
  //   component.ngOnDestroy();
  //   // expect(component.langChangeSub.unsubscribe).toHaveBeenCalledTimes(2);
  //   // @ts-ignore
  //   expect(spy).toHaveBeenCalledTimes(2);
  // });
});
