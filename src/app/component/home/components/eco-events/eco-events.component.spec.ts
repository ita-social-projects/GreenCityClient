import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcoEventsComponent } from './eco-events.component';
import { EcoEventsItemComponent } from './eco-events-item/eco-events-item.component';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('EcoEventsComponent', () => {
  let component: EcoEventsComponent;
  let fixture: ComponentFixture<EcoEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EcoEventsComponent,
        EcoEventsItemComponent
      ],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        TranslateModule.forRoot()
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcoEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
