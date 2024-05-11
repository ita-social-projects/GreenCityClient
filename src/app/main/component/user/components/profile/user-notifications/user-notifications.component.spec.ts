import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserNotificationsComponent } from './user-notifications.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, BehaviorSubject } from 'rxjs';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Language } from 'src/app/main/i18n/Language';
import { PipeTransform, Pipe } from '@angular/core';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { FilterApproach } from '@global-user/models/notification.model';

@Pipe({ name: 'translate' })
class TranslatePipeMock implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('UserNotificationsComponent', () => {
  let component: UserNotificationsComponent;
  let fixture: ComponentFixture<UserNotificationsComponent>;
  const translateMock = {
    use() {
      return of();
    },
    get() {
      return of();
    }
  };
  const localStorageServiceMock = jasmine.createSpyObj('localStorageService', [
    'languageBehaviourSubject',
    'getCurrentLanguage',
    'getUserId'
  ]);
  localStorageServiceMock.languageBehaviourSubject = new BehaviorSubject('ua');
  localStorageServiceMock.getCurrentLanguage = () => 'en' as Language;
  localStorageServiceMock.languageSubject = of('en');
  localStorageServiceMock.getUserId = () => 1;

  const filterApproaches = [
    { name: FilterApproach.ALL, isSelected: true, nameUa: 'Усі', nameEn: 'All' },
    { name: FilterApproach.TYPE, isSelected: false, nameUa: 'Типом', nameEn: 'Type' },
    { name: FilterApproach.ORIGIN, isSelected: false, nameUa: 'Джерелом', nameEn: 'Origin' }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserNotificationsComponent, TranslatePipeMock],
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: TranslateService, useValue: translateMock },
        { provide: MatSnackBarComponent, useValue: {} }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getNotification methods on Init', () => {
    const spy = spyOn(component, 'getNotification');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should change filter aproach', () => {
    const eventKeyboard = new KeyboardEvent('keydown', { key: 'Enter' });
    const eventClick = new MouseEvent('click');
    component.filterApproaches = filterApproaches;
    component.changefilterApproach(FilterApproach.TYPE, eventKeyboard);
    expect(component.filterApproaches.find((el) => el.name === FilterApproach.TYPE).isSelected).toBeTruthy();
    component.changefilterApproach(FilterApproach.ORIGIN, eventClick);
    expect(component.filterApproaches.find((el) => el.name === FilterApproach.TYPE).isSelected).toBeFalsy();
  });

  it('should return checkSelectedFilter', () => {
    component.filterApproaches = filterApproaches;
    expect(component.checkSelectedFilter(FilterApproach.TYPE)).toBeFalsy();
  });
});
