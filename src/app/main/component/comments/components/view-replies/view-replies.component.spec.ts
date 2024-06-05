import { TranslateModule } from '@ngx-translate/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewRepliesComponent } from './view-replies.component';

describe('ViewRepliesComponent', () => {
  let component: ViewRepliesComponent;
  let fixture: ComponentFixture<ViewRepliesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ViewRepliesComponent],
      imports: [TranslateModule.forRoot()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRepliesComponent);
    component = fixture.componentInstance;
    component.repliesCounter = 1;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
