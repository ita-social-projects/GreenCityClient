import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoDragAndDropPopUpComponent } from './photo-drag-and-drop-pop-up.component';

describe('PhotoDragAndDropPopUpComponent', () => {
  let component: PhotoDragAndDropPopUpComponent;
  let fixture: ComponentFixture<PhotoDragAndDropPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PhotoDragAndDropPopUpComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoDragAndDropPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
