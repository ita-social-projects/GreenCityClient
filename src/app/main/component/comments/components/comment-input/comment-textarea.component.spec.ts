import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentTextareaComponent } from './comment-textarea.component';
import { Router } from '@angular/router';

describe('CommentInputComponent', () => {
  let component: CommentTextareaComponent;
  let fixture: ComponentFixture<CommentTextareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CommentTextareaComponent],
      providers: [{ provide: Router, useValue: {} }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
