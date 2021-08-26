import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { HabitsListViewComponent } from './habits-list-view.component';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('HabitsListViewComponent', () => {
  let component: HabitsListViewComponent;
  let fixture: ComponentFixture<HabitsListViewComponent>;
  let MatSnackBarMock: MatSnackBarComponent;
  MatSnackBarMock = jasmine.createSpyObj('MatSnackBarComponent', ['openSnackBar']);
  MatSnackBarMock.openSnackBar = (type: string) => {};
  let httpTestingController: HttpTestingController;

  beforeEach(async(() => {
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
    component.habit = {
      complexity: 1,
      defaultDuration: 14,
      habitTranslation: {
        description: 'test',
        habitItem: 'test',
        languageCode: 'en',
        name: 'test'
      },
      id: 503,
      image: 'test',
      tags: ['test1', 'test2']
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
