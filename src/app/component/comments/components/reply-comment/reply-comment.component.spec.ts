import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplyCommentComponent } from './reply-comment.component';

describe('ReplyCommentComponent', () => {
  let component: ReplyCommentComponent;
  let fixture: ComponentFixture<ReplyCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReplyCommentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplyCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
