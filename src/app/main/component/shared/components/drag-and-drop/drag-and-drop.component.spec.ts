import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DragAndDropComponent } from './drag-and-drop.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { FileHandle } from '@eco-news-models/create-news-interface';
import { CreateEcoNewsService } from '@eco-news-service/create-eco-news.service';
import { DragAndDropDirective } from '../../../eco-news/directives/drag-and-drop.directive';

describe('DragAndDropComponent', () => {
  let component: DragAndDropComponent;
  let fixture: ComponentFixture<DragAndDropComponent>;
  let imageCroppedEventMock: ImageCroppedEvent;

  imageCroppedEventMock = {
    base64: 'test',
    width: 200,
    height: 200,
    cropperPosition: null,
    imagePosition: null,
    offsetImagePosition: null
  };

  const createEcoNewsServiceMock = jasmine.createSpyObj('CreateEcoNewsService', ['isBackToEditing', 'isImageValid']);
  createEcoNewsServiceMock.isBackToEditing = true;
  createEcoNewsServiceMock.isImageValid = true;

  const formDataMock: FormGroup = new FormGroup({
    content: new FormControl('asd aspd kasd ksdfj ksdjfi sdjf osd'),
    image: new FormControl('test'),
    source: new FormControl('https://www.telerik.com/blogs/testing-dynamic-forms-in-angular'),
    tags: new FormControl(['news, ads']),
    title: new FormControl('asd asd asd asd asd s')
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DragAndDropComponent, DragAndDropDirective],
      imports: [ImageCropperModule, FormsModule, HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [{ provide: CreateEcoNewsService, useValue: createEcoNewsServiceMock }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DragAndDropComponent);
    component = fixture.componentInstance;
    component.isWarning = false;
    component.isCropper = false;
    component.formData = formDataMock;
    component.files = [
      {
        url: 'http://',
        file: new File(['some content'], 'text-file.jpeg', { type: 'image/jpeg' })
      }
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should an image is cropped', () => {
    spyOn(component, 'imageCropped').withArgs(imageCroppedEventMock);
    component.imageCropped(imageCroppedEventMock);
    expect(component.imageCropped).toHaveBeenCalled();
  });

  it('should cancel changes', () => {
    component.cancelChanges();
    expect(component.files).toEqual([]);
    expect(component.isCropper).toBe(true);
  });

  it('should stop cropping an image', () => {
    component.stopCropping();
    expect(component.isCropper).toBe(false);
  });

  it('should file is dropped', () => {
    const files: FileHandle[] = [
      { url: 'http://', file: new File(['some content'], 'text-file.jpeg', { type: 'image/jpeg' }) },
      { url: 'http://', file: new File(['some content'], 'text-file.jpeg', { type: 'image/jpeg' }) }
    ];
    component.filesDropped(files);
    expect(createEcoNewsServiceMock.isImageValid).toBe(false);
  });

  it('should render a Warning title', () => {
    spyOn(component, 'showWarning');
    let warning: HTMLElement;
    warning = fixture.nativeElement.querySelector('.warning');
    expect(warning.textContent).toContain('drag-and-drop.picture-tooltip');
  });

  it('should patch an image', () => {
    spyOn(component, 'patchImage');
    component.patchImage();
    expect(component.isCropper).toBe(false);
    expect(component.patchImage).toHaveBeenCalled();
  });
});
