import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterSelectComponent } from './filter-select.component';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { TranslateModule } from '@ngx-translate/core';

describe('FilterSelectComponent', () => {
  let component: FilterSelectComponent;
  let fixture: ComponentFixture<FilterSelectComponent>;

  const languageServiceMock = jasmine.createSpyObj('languageService', ['getLangValue']);
  languageServiceMock.getLangValue = (valUa: string, valEn: string) => {
    return valUa;
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterSelectComponent],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: LanguageService, useValue: languageServiceMock }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return value on getLangValue', () => {
    const value = component.getLangValue('ua', 'en');
    expect(value).toBe('ua');
  });
});
