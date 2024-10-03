import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UpdateEventComponent } from './update-event.component';
import { EventStoreService } from '../../services/event-store.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../../../shared/shared.module';

describe('UpdateEventComponent', () => {
  let component: UpdateEventComponent;
  let fixture: ComponentFixture<UpdateEventComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateEventComponent],
      imports: [RouterTestingModule, HttpClientTestingModule, TranslateModule.forRoot(), SharedModule],
      providers: [EventStoreService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
