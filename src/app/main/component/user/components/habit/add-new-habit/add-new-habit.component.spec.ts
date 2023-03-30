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
import { ActivatedRoute, Router } from '@angular/router';
import { HabitResponseInterface } from 'src/app/main/interface/habit/habit-assign.interface';
import { Location } from '@angular/common';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { NEWHABIT } from 'src/app/main/mocks/habit-assign-mock';

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
    amountAcquiredUsers: 1,
    habitAssignStatus: 'ACQUIRED',
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

  fakeHabitAssignService = jasmine.createSpyObj('fakeHabitAssignService', [
    'getHabitByAssignId',
    'deleteHabitById',
    'assignCustomHabit',
    'setHabitStatus'
  ]);
  fakeHabitAssignService.getHabitByAssignId = () => of(NEWHABIT);
  fakeHabitAssignService.deleteHabitById = () => of();
  fakeHabitAssignService.assignCustomHabit = () => of(NEWHABIT);
  fakeHabitAssignService.setHabitStatus = () => of(NEWHABIT);

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

  fakeShoppingListService = jasmine.createSpyObj('fakeShoppingListService', [
    'getHabitAllShopLists',
    'getHabitShopList',
    'addHabitCustomShopList',
    'updateHabitShopList'
  ]);
  fakeShoppingListService.getHabitAllShopLists = () => of();
  fakeShoppingListService.getHabitShopList = () => of();
  fakeShoppingListService.addHabitCustomShopList = () => of();
  fakeShoppingListService.updateHabitShopList = () => of();

  matSnackBarMock.openSnackBar = (type: string) => {};

  const routerMock: Router = jasmine.createSpyObj('router', ['navigate']);

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
        { provide: Location, useValue: locationMock },
        { provide: Router, useValue: routerMock }
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

  it('should call getStars on initHabitData', () => {
    const spy = spyOn(component, 'getStars');
    (component as any).initHabitData(mockHabitResponse);
    expect(spy).toHaveBeenCalled();
  });

  it('should set data on initHabitData', () => {
    (component as any).initHabitData(mockHabitResponse);
    expect(component.habitResponse).toEqual(mockHabitResponse);
    expect(component.tags).toEqual(mockHabitResponse.tags);
    expect(component.initialDuration).toEqual(mockHabitResponse.defaultDuration);
  });

  it('getDefaultHabit should invoke inHabitData method', () => {
    const spy = spyOn(component as any, 'initHabitData');
    (component as any).getDefaultHabit();
    expect(spy).toHaveBeenCalled();
  });

  it('should navigate back on goBack', () => {
    const spy = spyOn(locationMock, 'back');
    component.goBack();
    expect(spy).toHaveBeenCalled();
  });

  it('getUserId should set this.userId', () => {
    (component as any).getUserId();
    expect(component.userId).toBe(2);
  });

  it('getDuration should set this.newDuration', () => {
    component.getDuration(1);
    expect(component.newDuration).toEqual(1);
  });

  it('getProgressValue should set canAcquire false', () => {
    component.getProgressValue(60);
    expect(component.canAcquire).toBeFalsy();
  });

  it('getProgressValue should set canAcquire true', () => {
    component.getProgressValue(80);
    expect(component.canAcquire).toBeTruthy();
  });

  it('checkIfAssigned method should call getCustomShopList', () => {
    (component as any).habitAssignId = 2;
    component.isEditing = true;
    const spy = spyOn(component as any, 'getCustomShopList');
    component.checkIfAssigned();
    expect(spy).toHaveBeenCalled();
  });

  it('checkIfAssigned method should invoke getDefaultHabit', () => {
    component.habitId = 3;
    component.isEditing = false;
    const spy1 = spyOn(component as any, 'getDefaultHabit');
    const spy2 = spyOn(component as any, 'getStandartShopList');
    component.checkIfAssigned();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('goToProfile method should navigate to user profile page', () => {
    component.userId = 2;
    component.goToProfile();
    expect(routerMock.navigate).toHaveBeenCalledWith(['profile', 2]);
  });

  it('ngOnDestroy should unsubscribe from subscription', () => {
    spyOn((component as any).langChangeSub, 'unsubscribe');
    component.ngOnDestroy();
    expect((component as any).langChangeSub.unsubscribe).toHaveBeenCalled();
  });
});
