import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsMainComponent } from './comments-main.component';

describe('CommentsMainComponent', () => {
  let component: CommentsMainComponent;
  let fixture: ComponentFixture<CommentsMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentsMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentsMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
