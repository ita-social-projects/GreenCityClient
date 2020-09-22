import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcoEventsItemComponent } from './eco-events-item.component';
import { EcoEventsComponent } from '../eco-events.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('EcoEventsItemComponent', () => {
  let component: EcoEventsItemComponent;
  let fixture: ComponentFixture<EcoEventsItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EcoEventsItemComponent,
        EcoEventsComponent
      ],
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot()
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcoEventsItemComponent);
    component = fixture.componentInstance;
    component.ecoEvent = {
      id: 0,
      title: '',
      text: '',
      creationDate: '',
      imagePath: ''
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
