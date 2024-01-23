import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsSelectComponent } from './tags-select.component';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { FIRSTTAGITEM, TAGLIST } from '@global-user/components/habit/mocks/tags-list-mock';

describe('TagsSelectComponent', () => {
  let component: TagsSelectComponent;
  let fixture: ComponentFixture<TagsSelectComponent>;

  const languageServiceMock = jasmine.createSpyObj('languageService', ['getLangValue']);
  languageServiceMock.getLangValue.and.returnValue('fakeTag');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TagsSelectComponent],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: LanguageService, useValue: languageServiceMock }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check tag', () => {
    const tags = { id: 1, name: 'Reusable', nameUa: 'Багаторазове використання', isActive: true };
    component.selectedList = null;
    component.tagsList = [tags];
    component.checkTab(FIRSTTAGITEM);
    expect(tags.isActive).toBeTruthy();
    expect(component.selectedList).toEqual([tags]);
  });

  it('should check maxLength of tags', () => {
    component.selectedList = null;
    let check = component.checkMaxLength(true);
    expect(check).toBeFalsy();
    component.selectedList = TAGLIST;
    component.tagMaxLength = null;
    check = component.checkMaxLength(true);
    expect(check).toBeFalsy();
    component.selectedList = TAGLIST;
    component.tagMaxLength = 3;
    check = component.checkMaxLength(true);
    expect(check).toBeFalsy();
    component.tagMaxLength = 1;
    check = component.checkMaxLength(false);
    expect(check).toBeTruthy();
  });

  it('should get value by language', () => {
    const valueByLang = (component as any).getLangValue('fakeTag', 'fakeTagEn');
    expect(valueByLang).toBe('fakeTag');
  });

  it('should set isActive to false for tagsList when tagsList has values', () => {
    const tagsList = [
      { id: 1, name: 'News', nameUa: 'Новини', isActive: true },
      { id: 2, name: 'Events', nameUa: 'Події', isActive: true },
      { id: 3, name: 'Education', nameUa: 'Освіта', isActive: true }
    ];
    component.tagsList = tagsList;
    component.changeValueIsActive();
    expect(component.tagsList).toEqual([
      { id: 1, name: 'News', nameUa: 'Новини', isActive: false },
      { id: 2, name: 'Events', nameUa: 'Події', isActive: false },
      { id: 3, name: 'Education', nameUa: 'Освіта', isActive: false }
    ]);
  });

  it('should not modify tagsList when tagsList is undefined', () => {
    component.tagsList = undefined;
    component.changeValueIsActive();
    expect(component.tagsList).toBeUndefined();
  });
});
