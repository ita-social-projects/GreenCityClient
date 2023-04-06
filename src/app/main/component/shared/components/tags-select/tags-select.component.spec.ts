import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsSelectComponent } from './tags-select.component';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from 'src/app/main/i18n/language.service';

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
    const tags = { id: 1, name: 'fakeTag', nameUa: 'Фейк тег', isActive: false };
    component.selectedList = null;
    component.tagsList = [tags];
    component.checkTab(tags);
    expect(tags.isActive).toBeTruthy();
    expect(component.selectedList).toEqual([tags]);
  });

  it('should get value by language', () => {
    const valueByLang = (component as any).getLangValue('fakeTag', 'fakeTagEn');
    expect(valueByLang).toBe('fakeTag');
  });
});
