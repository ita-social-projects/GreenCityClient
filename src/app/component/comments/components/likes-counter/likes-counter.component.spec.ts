import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LikesCounterComponent } from './likes-counter.component';

describe('LikesCounterComponent', () => {
  let component: LikesCounterComponent;
  let fixture: ComponentFixture<LikesCounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LikesCounterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LikesCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
