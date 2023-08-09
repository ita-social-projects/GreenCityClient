import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadPhotoContainerComponent } from './upload-photo-container.component';

describe('UploadPhotoContainerComponent', () => {
  let component: UploadPhotoContainerComponent;
  let fixture: ComponentFixture<UploadPhotoContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UploadPhotoContainerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadPhotoContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
