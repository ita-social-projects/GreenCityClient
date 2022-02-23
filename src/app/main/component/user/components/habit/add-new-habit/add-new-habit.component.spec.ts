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
    updateHabit: of('test'),
    assignCustomHabit: of('test')
  });
  fakeHabitService = jasmine.createSpyObj('fakeHabitService', {
    getHabitById: of(mockHabitResponse)
  });
  fakeLocalStorageService = jasmine.createSpyObj('fakeLocalStorageService', {
    getCurrentLanguage: () => 'ua'
  });
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
      imports: [RouterTestingModule, HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: MatSnackBarComponent, useValue: matSnackBarMock },
        { provide: HabitService, useValue: fakeHabitService },
        { provide: HabitAssignService, useValue: fakeHabitAssignService },
        { provide: ShoppingListService, useValue: fakeShoppingListService },
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

  it('bindLang(lang) should invoke translate.setDefaultLang(lang)', () => {
    // @ts-ignore
    spyOn(component.translate, 'setDefaultLang').and.returnValue();
    // @ts-ignore
    component.bindLang('en');
    // @ts-ignore
    expect(component.translate.setDefaultLang).toHaveBeenCalledWith('en');
  });

  it('changing of fakeLocalStorageService.languageSubject should invoke methods', () => {
    spyOn(component, 'checkIfAssigned').and.returnValue();
    // @ts-ignore
    spyOn(component, 'bindLang').and.returnValue();
    fakeLocalStorageService.languageSubject.subscribe((lang) => {
      // @ts-ignore
      expect(component.bindLang).toHaveBeenCalledWith(lang);
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

  it('goToMyHabits method should navigate', () => {
    component.userId = '2';
    // @ts-ignore
    spyOn(component.router, 'navigate').and.returnValue();
    component.goToMyHabits();
    // @ts-ignore
    expect(component.router.navigate).toHaveBeenCalledWith([`/profile/2/allhabits`]);
  });

  it('getUserId should set this.userId', () => {
    localStorage.setItem('userId', '2');
    // @ts-ignore
    component.getUserId();
    expect(component.userId).toBe('2');
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
    component.isAssigned = false;
    spyOn(component, 'getCustomItems').and.returnValue();
    component.checkIfAssigned();
    expect(component.getCustomItems).toHaveBeenCalled();
  });

  it('checkIfAssigned method should invoke getDefaultItems', () => {
    component.habitId = 3;
    component.isAssigned = false;
    spyOn(component, 'getDefaultItems').and.returnValue();
    component.checkIfAssigned();
    expect(component.getDefaultItems).toHaveBeenCalled();
  });

  it('cancel method should navigate', () => {
    component.userId = '2';
    // @ts-ignore
    spyOn(component.router, 'navigate').and.returnValue();
    component.cancel();
    // @ts-ignore
    expect(component.router.navigate).toHaveBeenCalledWith(['profile', component.userId]);
  });

  it('method addHabit should navigate and openSnackBar', () => {
    component.userId = '2';
    component.newList = [
      {
        selected: true,
        id: 2,
        status: 'test',
        text: 'test'
      }
    ];
    // @ts-ignore
    spyOn(component.router, 'navigate').and.returnValue();
    // @ts-ignore
    spyOn(component.snackBar, 'openSnackBar').and.returnValue();
    component.addHabit();
    // @ts-ignore
    expect(component.snackBar.openSnackBar).toHaveBeenCalledWith('habitAdded');
    // @ts-ignore
    expect(component.router.navigate).toHaveBeenCalledWith(['profile', component.userId]);
  });

  it('method updateHabit should navigate and openSnackBar', () => {
    component.userId = '2';
    component.newList = [
      {
        selected: true,
        id: 2,
        status: 'test',
        text: 'test'
      }
    ];
    // @ts-ignore
    spyOn(component.router, 'navigate').and.returnValue();
    // @ts-ignore
    spyOn(component.snackBar, 'openSnackBar').and.returnValue();
    component.updateHabit();
    // @ts-ignore
    expect(component.snackBar.openSnackBar).toHaveBeenCalledWith('habitUpdated');
    // @ts-ignore
    expect(component.router.navigate).toHaveBeenCalledWith(['profile', component.userId]);
  });

  it('method deleteHabit should navigate and openSnackBar', () => {
    component.userId = '2';
    // @ts-ignore
    spyOn(component.router, 'navigate').and.returnValue();
    // @ts-ignore
    spyOn(component.snackBar, 'openSnackBar').and.returnValue();
    component.deleteHabit();
    // @ts-ignore
    expect(component.snackBar.openSnackBar).toHaveBeenCalledWith('habitDeleted');
    // @ts-ignore
    expect(component.router.navigate).toHaveBeenCalledWith(['profile', component.userId]);
  });

  it('ngOnDestroy should unsubscribe from subscription', () => {
    // @ts-ignore
    spyOn(component.langChangeSub, 'unsubscribe');
    component.ngOnDestroy();
    // @ts-ignore
    expect(component.langChangeSub.unsubscribe).toHaveBeenCalled();
  });
});
