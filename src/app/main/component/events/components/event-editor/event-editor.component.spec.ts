import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { ActionsSubject, Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { TranslationServiceStub } from '../../../eco-news/eco-news.component.spec';
import { EventStoreService } from '../../services/event-store.service';
import { EventsService } from '../../services/events.service';
import { EventEditorComponent } from './event-editor.component';

describe('EventEditorComponent', () => {
  let component: EventEditorComponent;
  let eventsService: EventsService;
  let fixture: ComponentFixture<EventEditorComponent>;
  let fb: FormBuilder;
  const actionSub: ActionsSubject = new ActionsSubject();
  const storeMock = jasmine.createSpyObj('store', ['select', 'dispatch']);
  const MatSnackBarMock: MatSnackBarComponent = jasmine.createSpyObj('MatSnackBarComponent', ['openSnackBar']);
  const eventsServiceMock = jasmine.createSpyObj('EventsService', ['createEvent', 'updateEvent', 'getEvent', 'setEvent']);
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EventEditorComponent],
      imports: [MatDialogModule, RouterModule, HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({ id: '1' }) } },
        { provide: ActionsSubject, useValue: actionSub },
        { provide: Store, useValue: storeMock },
        { provide: MatSnackBarComponent, useValue: MatSnackBarMock },
        { provide: MatDialogRef, useValue: {} },
        { provide: EventsService, useValue: eventsServiceMock },
        { provide: TranslateService, useClass: TranslationServiceStub },
        EventStoreService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventEditorComponent);
    component = fixture.componentInstance;
    fb = TestBed.inject(FormBuilder);

    fixture.detectChanges();
  });

  describe('onPreview', () => {
    it('should call onPreview method with event form value', () => {
      spyOn(component, 'onPreview').and.callThrough();
      spyOn(component['router'], 'navigate');

      component.onPreview();

      expect(component.onPreview).toHaveBeenCalled();
      expect(component['router'].navigate).toHaveBeenCalledWith(['events', 'preview']);
    });
  });

  describe('submitEvent', () => {
    it('should create FormData and call createEvent indirectly when isUpdating is false', () => {});

    it('should create FormData with updated eventDto when isUpdating is true', () => {});
  });

  describe('clear', () => {
    it('should reset the form when clear() is called', () => {
      spyOn(component.eventForm, 'reset');
      component.clear();
      expect(component.eventForm.reset).toHaveBeenCalled();
    });
  });

  describe('escapeFromCreateEvent', () => {
    it('should navigate to /events', () => {
      spyOn(component['router'], 'navigate');

      component.escapeFromCreateEvent();

      expect(component['router'].navigate).toHaveBeenCalledWith(['/events']);
    });
  });
});
