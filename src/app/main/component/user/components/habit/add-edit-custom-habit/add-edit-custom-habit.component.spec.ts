import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AddEditCustomHabitComponent } from './add-edit-custom-habit.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HabitService } from '@global-service/habit/habit.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of, Subject, BehaviorSubject } from 'rxjs';
import { TagInterface } from '@shared/components/tag-filter/tag-filter.model';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Router } from '@angular/router';
import { Language } from 'src/app/main/i18n/Language';
import { ShoppingList } from '@global-user/models/shoppinglist.interface';

describe('AddEditCustomHabitComponent', () => {
  let component: AddEditCustomHabitComponent;
  let fixture: ComponentFixture<AddEditCustomHabitComponent>;

  const tagsMock: TagInterface[] = [{ id: 1, name: 'Tag', nameUa: 'Тег', isActive: true }];

  const localStorageServiceMock = jasmine.createSpyObj('localStorageService', ['getUserId', 'getCurrentLanguage']);

  localStorageServiceMock.getUserId = () => 2;
  localStorageServiceMock.languageSubject = new Subject<string>();
  localStorageServiceMock.languageBehaviourSubject = new BehaviorSubject('ua');
  localStorageServiceMock.getCurrentLanguage = () => 'ua' as Language;

  const habitServiceMock = jasmine.createSpyObj('fakeHabitAssignService', ['getAllTags', 'addCustomHabit']);
  habitServiceMock.getAllTags = () => of(tagsMock);
  habitServiceMock.addCustomHabit = () => of(null);

  const routerMock: Router = jasmine.createSpyObj('router', ['navigate']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditCustomHabitComponent],
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule,
        BrowserAnimationsModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: HabitService, useValue: habitServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditCustomHabitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call methods onInit', () => {
    const spy1 = spyOn(component as any, 'getUserId');
    const spy2 = spyOn(component as any, 'initForm');
    const spy3 = spyOn(component as any, 'getHabitTags');
    const spy4 = spyOn(component as any, 'subscribeToLangChange');
    component.ngOnInit();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
  });

  it('getUserId should set userId', () => {
    (component as any).getUserId();
    expect((component as any).userId).toBe(2);
  });

  it('should return title Control on getControl', () => {
    (component as any).initForm();
    const title = component.getControl('title');
    expect(title).toEqual(component.habitForm.get('title'));
  });

  it('subscribeToLangChange should set current language', () => {
    (component as any).subscribeToLangChange();
    expect((component as any).currentLang).toBe('ua');
  });

  it('getStars should return right star image', () => {
    let starImage = component.getStars(1, 3);
    expect(starImage).toBe('assets/img/icon/star-1.png');
    starImage = component.getStars(3, 2);
    expect(starImage).toBe('assets/img/icon/star-2.png');
  });

  it('should set duration after get it from child component', () => {
    (component as any).initForm();
    component.getDuration(15);
    expect(component.habitForm.get('duration').value).toBe(15);
  });

  it('should set shopList after get it from child component', () => {
    const newShopList: ShoppingList[] = [
      {
        id: 1,
        status: 'INPROGRESS',
        text: 'Some item',
        selected: true,
        custom: true
      }
    ];
    const convertedList: ShoppingList[] = [{ id: 1, status: 'INPROGRESS', text: 'Some item' }];
    (component as any).initForm();
    component.getShopList(newShopList);
    expect(component.newList).toEqual(convertedList);
    expect(component.habitForm.get('shopList').value).toEqual(convertedList);
  });

  it('should set TagList after get it from child component', () => {
    (component as any).initForm();
    component.getTagsList(tagsMock);
    expect(component.selectedTagsList).toEqual([1]);
    expect(component.habitForm.get('tagIds').value).toEqual([1]);
  });

  it('goToAllHabits should navigate to all habits page', () => {
    (component as any).userId = 2;
    component.goToAllHabits();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/profile/2/allhabits']);
  });

  it('should set tagsList on getHabitTags', () => {
    (component as any).getHabitTags();
    expect(component.tagsList).toEqual(tagsMock);
  });

  it('should call goToAllHabits on addHabit', () => {
    const spy = spyOn(component, 'goToAllHabits');
    component.addHabit();
    expect(spy).toHaveBeenCalled();
  });
});
