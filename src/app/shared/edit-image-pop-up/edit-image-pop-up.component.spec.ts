import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditImagePopUpComponent } from './edit-image-pop-up.component';

describe('EditImagePopUpComponent', () => {
  let component: EditImagePopUpComponent;
  let fixture: ComponentFixture<EditImagePopUpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditImagePopUpComponent]
    });
    fixture = TestBed.createComponent(EditImagePopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
