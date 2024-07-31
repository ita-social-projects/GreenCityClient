import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { TagFilterComponent } from './tag-filter.component';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { FilterModel } from './tag-filter.model';
import { LangValueDirective } from 'src/app/shared/directives/lang-value/lang-value.directive';
import { of } from 'rxjs';

describe('TagFilterComponent', () => {
  let component: TagFilterComponent;
  let fixture: ComponentFixture<TagFilterComponent>;

  const languageServiceMock = jasmine.createSpyObj('languageService', ['getLangValue', 'getCurrentLangObs']);
  languageServiceMock.getLangValue.and.returnValue('fakeTag');
  languageServiceMock.getCurrentLangObs.and.returnValue(of('ua'));

  const tagsListDataMock: Array<FilterModel> = [
    { name: 'test', nameUa: 'тест', isActive: false },
    { name: 'test2', nameUa: 'тест2', isActive: false }
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TagFilterComponent, LangValueDirective],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: LanguageService, useValue: languageServiceMock }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagFilterComponent);
    component = fixture.componentInstance;
    (component as any).storageKey = 'Test';
    component.tagsListData = tagsListDataMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call methods OnInit', () => {
    const spy = spyOn(component as any, 'getSessionStorageFilters');
    const spy1 = spyOn(component, 'emitActiveFilters');

    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
  });

  it('Should change filter state to true', () => {
    component.toggleFilter('test');
    expect(component.filters[0].isActive).toBe(true);
  });

  afterAll(() => (component as any).cleanSessionStorageFilters());
});
