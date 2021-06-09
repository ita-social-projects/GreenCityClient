import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { MessageBackEndComponent } from './message-back-end.component';

describe('MessageBackEndComponent', () => {
  let component: MessageBackEndComponent;
  let fixture: ComponentFixture<MessageBackEndComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MessageBackEndComponent],
      imports: [TranslateModule.forRoot()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageBackEndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
