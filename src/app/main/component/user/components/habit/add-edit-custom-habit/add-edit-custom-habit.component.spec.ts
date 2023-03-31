import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCustomHabitComponent } from './add-edit-custom-habit.component';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HabitService } from '@global-service/habit/habit.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { TagInterface } from '@shared/components/tag-filter/tag-filter.model';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Router } from '@angular/router';

describe('AddEditCustomHabitComponent', () => {
  let component: AddEditCustomHabitComponent;
  let fixture: ComponentFixture<AddEditCustomHabitComponent>;

  const tagsMock: TagInterface[] = [{ id: 1, name: 'Tag', nameUa: 'Тег', isActive: true }];

  const localStorageServiceMock = jasmine.createSpyObj('localStorageService', {
    getCurrentLanguage: () => 'ua'
  });
  localStorageServiceMock.getUserId = () => 2;
  localStorageServiceMock.languageSubject = new Subject<string>();
  localStorageServiceMock.languageSubject.next('ua');

  const habitServiceMock = jasmine.createSpyObj('fakeHabitAssignService', ['getAllTags', 'addCustomHabit']);
  habitServiceMock.getAllTags = () => of(tagsMock);

  const languageServiceMock = jasmine.createSpyObj('languageService', ['getLangValue']);
  languageServiceMock.getLangValue.and.returnValue('fakeTag');

  const routerMock: Router = jasmine.createSpyObj('router', ['navigate']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditCustomHabitComponent],
      imports: [TranslateModule.forRoot(), RouterTestingModule, BrowserAnimationsModule, NoopAnimationsModule, ReactiveFormsModule],
      providers: [
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: HabitService, useValue: habitServiceMock },
        { provide: LanguageService, useValue: languageServiceMock },
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
});
