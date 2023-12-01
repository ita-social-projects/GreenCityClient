import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { HabitsListViewComponent } from './habits-list-view.component';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DEFAULTHABIT } from '@global-user/components/habit/mocks/habit-assigned-mock';

describe('HabitsListViewComponent', () => {
  let component: HabitsListViewComponent;
  let fixture: ComponentFixture<HabitsListViewComponent>;
  let MatSnackBarMock: MatSnackBarComponent;
  MatSnackBarMock = jasmine.createSpyObj('MatSnackBarComponent', ['openSnackBar']);
  MatSnackBarMock.openSnackBar = (type: string) => {};
  let httpTestingController: HttpTestingController;

  const defaultImagePath =
    'https://csb10032000a548f571.blob.core.windows.net/allfiles/90370622-3311-4ff1-9462-20cc98a64d1ddefault_image.jpg';

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HabitsListViewComponent],
      imports: [TranslateModule.forRoot(), RouterTestingModule, MatSnackBarModule, HttpClientTestingModule],
      providers: [{ provide: MatSnackBarComponent, useValue: MatSnackBarMock }]
    }).compileComponents();
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HabitsListViewComponent);
    component = fixture.componentInstance;
    component.habit = DEFAULTHABIT;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
