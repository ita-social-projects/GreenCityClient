import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentLikeReplyComponent } from './comment-like-reply.component';

describe('CommentLikeReplyComponent', () => {
  let component: CommentLikeReplyComponent;
  let fixture: ComponentFixture<CommentLikeReplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentLikeReplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentLikeReplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
