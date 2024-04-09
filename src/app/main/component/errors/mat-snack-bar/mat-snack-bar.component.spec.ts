import { MatSnackBarModule } from '@angular/material/snack-bar';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarComponent } from './mat-snack-bar.component';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('MatSnackBarComponent', () => {
  let component: MatSnackBarComponent;
  let fixture: ComponentFixture<MatSnackBarComponent>;
  let matSnackBarMock: MatSnackBar;
  matSnackBarMock = jasmine.createSpyObj('MatSnackBar', ['open']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MatSnackBarComponent],
      imports: [MatSnackBarModule, TranslateModule.forRoot(), BrowserAnimationsModule],
      providers: [{ provide: MatSnackBar, useValue: matSnackBarMock }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatSnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Basic tests', () => {
    it('should create matSnackComponent', () => {
      expect(component).toBeTruthy();
    });

    it('should call openSnackBar()', () => {
      const spy = spyOn(component, 'openSnackBar').and.callThrough();
      component.openSnackBar('error');
      expect(spy).toHaveBeenCalled();
    });

    it('should call getSnackBarMessage()', () => {
      const spy = spyOn(component, 'getSnackBarMessage').and.callThrough();
      component.getSnackBarMessage('error');
      expect(spy).toHaveBeenCalled();
    });
  });
});
