import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepliesMainComponent } from './replies-main.component';

describe('RepliesMainComponent', () => {
  let component: RepliesMainComponent;
  let fixture: ComponentFixture<RepliesMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RepliesMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepliesMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
