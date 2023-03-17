import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ShoppingListComponent } from './shopping-list.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { HabitService } from '@global-service/habit/habit.service';
import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { of, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HabitResponseInterface } from 'src/app/main/interface/habit/habit-assign.interface';
import { Location } from '@angular/common';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { ShoppingListService } from '@global-user/components/habit/add-new-habit/habit-edit-shopping-list/shopping-list.service';

describe('ShoppingListComponent', () => {
  let component: ShoppingListComponent;
  let fixture: ComponentFixture<ShoppingListComponent>;

  let ShoppingListServiceMock: ShoppingListService;
  let LocalStorageServiceMock: LocalStorageService;

  const mockHabitResponse: HabitResponseInterface = {
    complexity: 2,
    defaultDuration: 2,
    amountAcquiredUsers: 1,
    habitAssignStatus: 'ACQUIRED',
    habitTranslation: {
      description: 'test',
      habitItem: 'test',
      languageCode: 'test',
      name: 'test'
    },
    id: 2,
    image: 'test',
    shoppingListItems: [],
    tags: []
  };

  LocalStorageServiceMock = jasmine.createSpyObj('fakeLocalStorageService', {
    getCurrentLanguage: () => 'ua'
  });
  LocalStorageServiceMock.getUserId = () => 2;
  LocalStorageServiceMock.languageSubject = new Subject<string>();
  LocalStorageServiceMock.languageSubject.next('ua');

  ShoppingListServiceMock = jasmine.createSpyObj('fakeShoppingListService', [
    'getCustomShopList',
    'getShopList',
    'updateStandardShopItemStatus',
    'updateCustomShopItemStatus'
  ]);
  ShoppingListServiceMock.getHabitAllShopLists = () => of();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShoppingListComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        BrowserAnimationsModule,
        NoopAnimationsModule,
        MatDialogModule
      ],
      providers: [
        { provide: ShoppingListService, useValue: ShoppingListServiceMock },
        { provide: LocalStorageService, useValue: LocalStorageServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('bindLang(lang) should invoke translate.setDefaultLang(lang)', () => {
    spyOn((component as any).translate, 'setDefaultLang').and.returnValue('test');
    (component as any).bindLang('en');
    expect((component as any).translate.setDefaultLang).toHaveBeenCalledWith('en');
  });
});
