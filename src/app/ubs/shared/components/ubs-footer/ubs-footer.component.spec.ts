import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UbsFooterComponent } from './ubs-footer.component';
import { of, Subject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Injectable, ElementRef } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtService } from '@global-service/jwt/jwt.service';
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

class MockJwtService {
  userRole$ = new Subject<string>();
}

describe('UbsFooterComponent', () => {
  const translateServiceMock: TranslateService = jasmine.createSpyObj('TranslateService', ['setDefaultLang']);
  translateServiceMock.setDefaultLang = (lang: string) => of();
  translateServiceMock.get = () => of(true);
  let mockJwtService: MockJwtService;
  let component: UbsFooterComponent;
  let fixture: ComponentFixture<UbsFooterComponent>;
  let dialog: MatDialog;

  beforeEach(waitForAsync(() => {
    mockJwtService = new MockJwtService();

    TestBed.configureTestingModule({
      declarations: [UbsFooterComponent],
      imports: [TranslateModule.forRoot(), MatDialogModule, RouterTestingModule],
      providers: [
        { provide: TranslateService, useClass: TranslationServiceStub },
        { provide: MatDialog, useClass: MatDialogMock },
        { provide: JwtService, useValue: mockJwtService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsFooterComponent);
    component = fixture.componentInstance;
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
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

  it('should set isUbsAdmin to true if the role is ROLE_UBS_EMPLOYEE', () => {
    mockJwtService.userRole$.next('ROLE_UBS_EMPLOYEE');

    expect(component.isUbsAdmin).toBe(true);
  });

  it('should set isUbsAdmin to false if the role is not ROLE_UBS_EMPLOYEE', () => {
    mockJwtService.userRole$.next('ROLE_USER');

    expect(component.isUbsAdmin).toBe(false);
  });

  it('should open the about service pop-up', () => {
    const dialogSpy = spyOn(dialog, 'open').and.returnValue({
      afterClosed: () => of(true)
    } as MatDialogRef<UbsPickUpServicePopUpComponent>);
    const eventMock = { preventDefault: () => {} } as Event;
    const preventDefaultSpy = spyOn(eventMock, 'preventDefault');

    component.openAboutServicePopUp(eventMock);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(dialogSpy).toHaveBeenCalledWith(UbsPickUpServicePopUpComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      panelClass: 'custom-dialog-container',
      backdropClass: 'background-transparent',
      height: '640px'
    });
  });

  it('should call focus on serviceref after pop-up is closed', () => {
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(true) });
    spyOn(dialog, 'open').and.returnValue(dialogRefSpyObj);
    const mockElement = { nativeElement: { focus: () => {} } };
    component.serviceref = mockElement as ElementRef;
    const focusSpy = spyOn(component.serviceref.nativeElement, 'focus');
    const eventMock = { preventDefault: () => {} } as Event;

    component.openAboutServicePopUp(eventMock);

    expect(focusSpy).toHaveBeenCalled();
  });

  it('should call openAboutServicePopUp and preventDefault on key press', () => {
    const openPopUpSpy = spyOn(component, 'openAboutServicePopUp');
    const eventMock = { preventDefault: () => {} } as Event;
    const preventDefaultSpy = spyOn(eventMock, 'preventDefault');

    component.onPressEnter(eventMock);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(openPopUpSpy).toHaveBeenCalledWith(eventMock);
  });

  it('should complete the destroySub subject on ngOnDestroy', () => {
    const destroySubSpy = spyOn(component[`destroySub`], 'complete');
    component.ngOnDestroy();
    expect(destroySubSpy).toHaveBeenCalled();
  });
});
