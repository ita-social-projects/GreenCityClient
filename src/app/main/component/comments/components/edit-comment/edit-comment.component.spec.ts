import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { EditCommentComponent } from './edit-comment.component';

describe('EditCommentComponent', () => {
  let component: EditCommentComponent;
  let fixture: ComponentFixture<EditCommentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditCommentComponent],
      imports: [TranslateModule.forRoot()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit on click', () => {
    spyOn(component.isEditing, 'emit');
    const nativeElement = fixture.nativeElement;
    const button = nativeElement.querySelector('button');
    button.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(component.isEditing.emit).toHaveBeenCalled();
  });
});
