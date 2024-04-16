import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisionCardComponent } from './vision-card.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Injectable, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

@Injectable()
class TranslationServiceStub {
  public onLangChange = new EventEmitter<any>();
  public onTranslationChange = new EventEmitter<any>();
  public onDefaultLangChange = new EventEmitter<any>();
  public addLangs(langs: string[]) {}
  public getLangs() {
    return 'en-us';
  }
  public getBrowserLang() {
    return '';
  }
  public getBrowserCultureLang() {
    return '';
  }
  public use(lang: string) {
    return '';
  }
  public get(key: any): any {
    return of(key);
  }
  public setDefaultLang() {
    return true;
  }
}

describe('VisionCardComponent', () => {
  let component: VisionCardComponent;
  let fixture: ComponentFixture<VisionCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VisionCardComponent],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: TranslateService, useClass: TranslationServiceStub }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
