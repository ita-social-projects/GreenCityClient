import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UbsFooterComponent } from './ubs-footer.component';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Injectable } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UbsPickUpServicePopUpComponent } from 'src/app/ubs/ubs/components/ubs-pick-up-service-pop-up/ubs-pick-up-service-pop-up.component';

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

class MatDialogMock {
  open() {
    return {
      afterClosed: () => of(true)
    };
  }
}

describe('UbsFooterComponent', () => {
  let translateServiceMock: TranslateService;
  translateServiceMock = jasmine.createSpyObj('TranslateService', ['setDefaultLang']);
  translateServiceMock.setDefaultLang = (lang: string) => of();
  translateServiceMock.get = () => of(true);
  let component: UbsFooterComponent;
  let fixture: ComponentFixture<UbsFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsFooterComponent],
      imports: [TranslateModule.forRoot(), MatDialogModule],
      providers: [
        { provide: TranslateService, useClass: TranslationServiceStub },
        { provide: MatDialog, useClass: MatDialogMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set ubsNavLinks correctly', () => {
    expect(component.ubsNavLinks).toBeDefined();
    expect(component.ubsNavLinks.length).toBeGreaterThan(0);
  });

  it('should set socialLinks correctly', () => {
    expect(component.socialLinks).toBeDefined();
    expect(component.socialLinks.length).toBeGreaterThan(0);
  });

  it('should set screenWidth on resize', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024
    });

    window.dispatchEvent(new Event('resize'));
    expect(component.screenWidth).toEqual(1024);
  });
});
