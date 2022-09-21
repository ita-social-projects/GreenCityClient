import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { EventsListItemModalComponent } from './events-list-item-modal.component';
import { RatingModule } from 'ngx-bootstrap/rating';
import { BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';

xdescribe('EventsListItemModalComponent', () => {
  let component: EventsListItemModalComponent;
  let fixture: ComponentFixture<EventsListItemModalComponent>;

  const storeMock = jasmine.createSpyObj('store', ['dispatch']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EventsListItemModalComponent],
      providers: [
        { provide: Store, useValue: storeMock },
        { provide: BsModalRef, useValue: {} },
        { provide: TranslateService, useValue: {} },
      ],
      imports: [
        RatingModule.forRoot(), ModalModule.forRoot(),
        MatDialogModule,
        TranslateModule.forRoot()
      ],

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsListItemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
