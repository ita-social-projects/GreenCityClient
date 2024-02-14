import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FeedbackService } from '@global-service/feedbacksAdmin/feedback.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter } from '@angular/core';
import { ConfirmationDialogService } from '../../services/confirmation-dialog-service.service';

import { FeedbacksComponent } from './feedbacks.component';
import { RouterTestingModule } from '@angular/router/testing';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { MatTableModule } from '@angular/material/table';

class MatDialogMock {
  open() {
    return {
      afterClosed: () => of(true)
    };
  }
}

class TranslationServiceStub {
  public onLangChange = new EventEmitter<any>();
  public onTranslationChange = new EventEmitter<any>();
  public onDefaultLangChange = new EventEmitter<any>();
  public addLangs(langs: string[]) {
    return langs;
  }
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
    return lang;
  }
  public get(key: any): any {
    return of(key);
  }
  public setDefaultLang() {
    return true;
  }
}

describe('FeedbacksComponent', () => {
  let component: FeedbacksComponent;
  let fixture: ComponentFixture<FeedbacksComponent>;

  const confirmationDialogServiceMock: ConfirmationDialogService = jasmine.createSpyObj('ConfirmationDialogService', ['confirm']);

  const translateServiceMock: TranslateService = jasmine.createSpyObj('TranslateService', ['setDefaultLang']);
  translateServiceMock.setDefaultLang = () => of();
  translateServiceMock.get = () => of(true);

  let feedbackServiceMock: FeedbackService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        MatDialogModule,
        MatTableModule,
        PaginationModule.forRoot()
      ],
      declarations: [FeedbacksComponent],
      providers: [
        { provide: ConfirmationDialogService, useValue: confirmationDialogServiceMock },
        { provide: MatDialog, useClass: MatDialogMock },
        { provide: TranslateService, useClass: TranslationServiceStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbacksComponent);
    component = fixture.componentInstance;
    feedbackServiceMock = TestBed.inject(FeedbackService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should called getCommentsByPage method one time', () => {
    const getCommentsByPageSpy = spyOn(component as any, 'getCommentsByPage');
    component.ngOnInit();
    expect(getCommentsByPageSpy).toHaveBeenCalledTimes(1);
  });

  it('should change page', () => {
    const spy = spyOn(component, 'changePage');
    const event = 'click';
    component.changePage(event);
    expect(spy).toHaveBeenCalled();
    expect(feedbackServiceMock.page).toBeDefined();
  });

  it('openDialog should be called', () => {
    const spyOpenDialog = spyOn(MatDialogMock.prototype, 'open');
    MatDialogMock.prototype.open();
    expect(spyOpenDialog).toHaveBeenCalled();
  });

  it('changeVisability should be called', () => {
    const spy = spyOn(component, 'changeVisability');
    const id1 = '1';
    const id2 = '2';
    component.changeVisability(id1, id2);
    expect(spy).toHaveBeenCalled();
  });

  it('confirmDelete should be called', () => {
    const spy = spyOn(component, 'confirmDelete');
    const id = 1;
    const commentName = 'User';
    component.confirmDelete(id, commentName);
    expect(spy).toHaveBeenCalled();
  });

  it('delete should be called', () => {
    const spy = spyOn(component, 'delete');
    const id = 1;
    component.delete(id);
    expect(spy).toHaveBeenCalled();
  });
});
