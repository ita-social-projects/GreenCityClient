import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPhotoComponent } from './dialog-photo.component';

describe('DialogPhotoComponent', () => {
  let component: DialogPhotoComponent;
  let fixture: ComponentFixture<DialogPhotoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogPhotoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
