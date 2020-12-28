import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HabitsGalleryViewComponent } from './habits-gallery-view.component';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


describe('HabitsGalleryViewComponent', () => {
  let component: HabitsGalleryViewComponent;
  let fixture: ComponentFixture<HabitsGalleryViewComponent>;
  let MatSnackBarMock: MatSnackBarComponent;
  MatSnackBarMock = jasmine.createSpyObj('MatSnackBarComponent', ['openSnackBar']);
  MatSnackBarMock.openSnackBar = (type: string) =>  { };
  let httpTestingController: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HabitsGalleryViewComponent ],
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule,
        MatSnackBarModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: MatSnackBarComponent, useValue: MatSnackBarMock }
      ]
    })
      .compileComponents();
    httpTestingController = TestBed.get(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HabitsGalleryViewComponent);
    component = fixture.componentInstance;
    component.habit = {
      image: './',
      habitTranslation: {
        habitItem: 'test',
        name: 'test',
        description: 'test'
      }
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
