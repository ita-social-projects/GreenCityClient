import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { EventsModule } from '../../events.module';
import { EventStoreService } from '../../services/event-store.service';
import { EventEditorComponent } from './event-editor.component';

describe('EventEditorComponent', () => {
  let component: EventEditorComponent;
  let fixture: ComponentFixture<EventEditorComponent>;
  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventEditorComponent],
      imports: [
        EventsModule,
      ],
      providers: [
        FormBuilder,
        provideRouter([
          { path: 'update-event/:id', component: EventEditorComponent }
        ]),
        provideHttpClient(),
        provideMockStore(),
        provideNoopAnimations(),
        { provide: MatDialogRef, useValue: {} },
        // { provide: ActivatedRoute, useValue: {params: {id: 22}} }
      ]
    });
    fixture = TestBed.createComponent(EventEditorComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  })

  it('sets submitButtonName to save-event if updating event', () => {
    component.isUpdating = true;
    fixture.detectChanges();
    expect(component.submitButtonName).toBe('create-event.save-event');
  });

  it('sets submitButtonName to publish if creating event', () => {
    component.isUpdating = false;
    fixture.detectChanges();
    expect(component.submitButtonName).toBe('create-event.publish');
  });

  describe('localStorageService calls in ngOnInit tests', () => {
    let localStorageService: LocalStorageService;
    let localStorageGetPrevPage: jasmine.Spy<any>;

    beforeEach(() => {
      localStorageService = TestBed.inject(LocalStorageService);
      localStorageGetPrevPage = spyOn(localStorageService, 'getPreviousPage');
    })

    it('sets previous path to profile if routed from profile', () => {
      localStorageGetPrevPage.and.returnValue('/profile');
      fixture.detectChanges();

      expect(localStorageGetPrevPage).toHaveBeenCalled();
      expect(component.previousPath).toBe('/profile');
    });

    it('sets previous path to events if routed from events', () => {
      localStorageGetPrevPage.and.returnValue('/events');
      fixture.detectChanges();

      expect(localStorageGetPrevPage).toHaveBeenCalled();
      expect(component.previousPath).toBe('/events');
    });
  });

  it('sets event store service event id to one found in route', async () => {
    const eventStoreService = TestBed.inject(EventStoreService);
    const route = TestBed.inject(ActivatedRoute);
    (route as any).params = of({id: 22}); // ActivatedRoute param :id = 22
    const eventStoreSetEventId = spyOn(eventStoreService, 'setEventId').and.stub();
    fixture.detectChanges();

    expect(eventStoreSetEventId).toHaveBeenCalledOnceWith(22);
  })
});
