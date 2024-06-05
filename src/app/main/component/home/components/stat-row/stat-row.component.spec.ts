import { TranslateModule } from '@ngx-translate/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StatRowComponent } from './stat-row.component';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { BehaviorSubject, of } from 'rxjs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CheckTokenService } from '@global-service/auth/check-token/check-token.service';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { APP_BASE_HREF } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';

class MatDialogMock {
  open() {
    return {
      afterClosed: () => of(true)
    };
  }
}

describe('StatRowComponent', () => {
  let component: StatRowComponent;
  let fixture: ComponentFixture<StatRowComponent>;

  const snackBarMock: MatSnackBarComponent = jasmine.createSpyObj('MatSnackBarComponent', ['openSnackBar']);
  snackBarMock.openSnackBar = () => true;

  const localStorageServiceMock: LocalStorageService = jasmine.createSpyObj('LocalStorageService', ['userIdBehaviorSubject']);
  localStorageServiceMock.userIdBehaviourSubject = new BehaviorSubject(1111);

  const checkTokenServiceMock: CheckTokenService = jasmine.createSpyObj('checkTokenservice', ['openAuthModalWindow']);

  const activatedRouteMock = {
    queryParams: of({
      token: '1',
      user_id: '1'
    })
  };

  const defaultImagePath =
    'https://csb10032000a548f571.blob.core.windows.net/allfiles/90370622-3311-4ff1-9462-20cc98a64d1ddefault_image.jpg';

  const routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [StatRowComponent],
      imports: [TranslateModule.forRoot(), RouterModule.forRoot([], {}), HttpClientTestingModule, MatSnackBarModule],
      providers: [
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: MatSnackBarComponent, useValue: snackBarMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialog, useClass: MatDialogMock },
        { provide: APP_BASE_HREF, useValue: '/' }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatRowComponent);
    component = fixture.componentInstance;
    component.stat = {
      action: 'test',
      caption: 'test',
      count: 'test',
      question: 'test',
      iconPath: defaultImagePath,
      locationText: 'test'
    };
    component.index = 1;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should be called', () => {
    const spyOnInit = spyOn(component, 'ngOnInit');
    component.ngOnInit();
    expect(spyOnInit).toHaveBeenCalled();
  });

  it('should get userId', () => {
    expect(localStorageServiceMock.userIdBehaviourSubject.value).toBe(1111);
  });

  it('should redirect to profile page', () => {
    fixture.ngZone.run(() => {
      component.startHabit();
      expect(routerSpy.navigate).toBeDefined();
    });
  });

  it('openAuthModalWindow should be called', () => {
    const spyOpenAuthModalWindow = spyOn(MatDialogMock.prototype, 'open');
    MatDialogMock.prototype.open();
    expect(spyOpenAuthModalWindow).toHaveBeenCalled();
  });
});
