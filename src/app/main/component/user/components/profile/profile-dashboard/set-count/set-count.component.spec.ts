import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetCountComponent } from './set-count.component';

describe('SetCountComponent', () => {
  let component: SetCountComponent;
  let fixture: ComponentFixture<SetCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SetCountComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
