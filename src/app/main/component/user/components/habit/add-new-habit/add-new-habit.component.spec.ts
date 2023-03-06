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
import { Location } from '@angular/common';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';

describe('AddNewHabitComponent', () => {
  let component: AddNewHabitComponent;
  let fixture: ComponentFixture<AddNewHabitComponent>;
  let matSnackBarMock: MatSnackBarComponent;
  let fakeHabitAssignService: HabitAssignService;
  let fakeShoppingListService: ShoppingListService;
  let fakeHabitService: HabitService;
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
    shoppingListItems: [],
    tags: []
  };
  const mockActivatedRoute = {
    params: of({ habitId: 2 })
  };
  const locationMock = { back: () => {} };

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
    updateHabit: of('test'),
    assignCustomHabit: of('test')
  });
  fakeHabitService = jasmine.createSpyObj('fakeHabitService', {
    getHabitById: of(mockHabitResponse)
  });

  fakeLocalStorageService = jasmine.createSpyObj('fakeLocalStorageService', {
    getCurrentLanguage: () => 'ua'
  });
  fakeLocalStorageService.getUserId = () => 2;
  fakeLocalStorageService.languageSubject = new Subject<string>();
  fakeLocalStorageService.languageSubject.next('ua');

  matSnackBarMock = jasmine.createSpyObj('MatSnackBarComponent', ['openSnackBar']);
  fakeShoppingListService = jasmine.createSpyObj('fakeShoppingListService', {
    saveCustomItems: of([])
  });
  matSnackBarMock.openSnackBar = (type: string) => {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewHabitComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        BrowserAnimationsModule,
        NoopAnimationsModule,
        MatDialogModule
      ],
      providers: [
        { provide: MatSnackBarComponent, useValue: matSnackBarMock },
        { provide: HabitService, useValue: fakeHabitService },
        { provide: HabitAssignService, useValue: fakeHabitAssignService },
        { provide: ShoppingListService, useValue: fakeShoppingListService },
        { provide: LocalStorageService, useValue: fakeLocalStorageService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Location, useValue: locationMock }
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

  it('bindLang(lang) should invoke translate.setDefaultLang(lang)', () => {
    spyOn((component as any).translate, 'setDefaultLang').and.returnValue('test');
    (component as any).bindLang('en');
    expect((component as any).translate.setDefaultLang).toHaveBeenCalledWith('en');
  });

  it('changing of fakeLocalStorageService.languageSubject should invoke methods', () => {
    spyOn(component, 'checkIfAssigned').and.returnValue();
    spyOn(component as any, 'bindLang').and.returnValue('test');
    fakeLocalStorageService.languageSubject.subscribe((lang) => {
      expect((component as any).bindLang).toHaveBeenCalledWith(lang);
      expect(component.checkIfAssigned).toHaveBeenCalled();
    });
    fakeLocalStorageService.languageSubject.next('en');
  });

  it('initHabitData() should set values and invoke getStars()', () => {
    spyOn(component, 'getStars').and.returnValue();
    component.initHabitData(mockHabitResponse);
    expect(component.habitResponse).toEqual(mockHabitResponse);
    expect(component.initialDuration).toEqual(mockHabitResponse.defaultDuration);
    expect(component.initialShoppingList).toEqual(mockHabitResponse.shoppingListItems);
    expect(component.getStars).toHaveBeenCalled();
  });

  it('getDefaultItems should invoke inHabitData method', () => {
    spyOn(component, 'initHabitData').and.returnValue();
    component.getDefaultItems();
    expect(component.initHabitData).toHaveBeenCalled();
  });

  it('getCustomItems should invoke inHabitData method', () => {
    spyOn(component, 'initHabitData').and.returnValue();
    component.getCustomItems();
    expect(component.initHabitData).toHaveBeenCalled();
  });

  it('onGoBack() should invoke location.back()', () => {
    const spyBack = spyOn(locationMock, 'back');
    component.onGoBack();
    expect(spyBack).toHaveBeenCalled();
  });

  it('getUserId should set this.userId', () => {
    (component as any).getUserId();
    expect(component.userId).toBe(2);
  });

  it('getDuration should set this.newDuration', () => {
    component.getDuration(1);
    expect(component.newDuration).toEqual(1);
  });

  it('getList should set this.newList', () => {
    component.getList([]);
    expect(component.newList).toEqual([]);
  });

  it('checkIfAssigned method should invoke getCustomItems', () => {
    component.habitId = 2;
    component.isEditing = false;
    spyOn(component, 'getCustomItems').and.returnValue();
    component.checkIfAssigned();
    expect(component.getCustomItems).toHaveBeenCalled();
  });

  it('checkIfAssigned method should invoke getDefaultItems', () => {
    component.habitId = 3;
    component.isEditing = false;
    spyOn(component, 'getDefaultItems').and.returnValue();
    component.checkIfAssigned();
    expect(component.getDefaultItems).toHaveBeenCalled();
  });

  it('cancel method should navigate', () => {
    component.userId = 2;
    spyOn((component as any).router, 'navigate').and.returnValue('test');
    component.cancelAdd();
    expect((component as any).router.navigate).toHaveBeenCalledWith(['profile', component.userId]);
  });

  it('method addHabit should navigate and openSnackBar', () => {
    component.userId = 2;
    component.newList = [
      {
        selected: true,
        id: 2,
        status: 'test',
        text: 'test'
      }
    ];
    spyOn((component as any).router, 'navigate').and.returnValue('test');
    spyOn((component as any).snackBar, 'openSnackBar').and.returnValue('test');
    component.addHabit();
    expect((component as any).snackBar.openSnackBar).toHaveBeenCalledWith('habitAdded');
    expect((component as any).router.navigate).toHaveBeenCalledWith(['profile', component.userId]);
  });

  it('method updateHabit should navigate and openSnackBar', () => {
    component.userId = 2;
    component.newList = [
      {
        selected: true,
        id: 2,
        status: 'test',
        text: 'test'
      }
    ];
    spyOn((component as any).router, 'navigate').and.returnValue('test');
    spyOn((component as any).snackBar, 'openSnackBar').and.returnValue('test');
    component.updateHabit();
    expect((component as any).snackBar.openSnackBar).toHaveBeenCalledWith('habitUpdated');
    expect((component as any).router.navigate).toHaveBeenCalledWith(['profile', component.userId]);
  });

  it('ngOnDestroy should unsubscribe from subscription', () => {
    spyOn((component as any).langChangeSub, 'unsubscribe');
    component.ngOnDestroy();
    expect((component as any).langChangeSub.unsubscribe).toHaveBeenCalled();
  });
});
