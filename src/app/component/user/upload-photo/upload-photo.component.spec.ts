import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPhotoComponent } from './upload-photo.component';

describe('UploadPhotoComponent', () => {
  let component: UploadPhotoComponent;
  let fixture: ComponentFixture<UploadPhotoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadPhotoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
