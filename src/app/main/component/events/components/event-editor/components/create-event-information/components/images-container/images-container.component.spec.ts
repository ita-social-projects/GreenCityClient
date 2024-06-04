import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { ImagesContainerComponent } from './images-container.component';
import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { FileHandle } from '@ubs/ubs-admin/models/file-handle.model';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EventsService } from 'src/app/main/component/events/services/events.service';
import { of } from 'rxjs';

@Pipe({ name: 'translate' })
class TranslatePipeMock implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('ImagesContainerComponent', () => {
  let component: ImagesContainerComponent;
  let fixture: ComponentFixture<ImagesContainerComponent>;

  const translateServiceMock = {
    setDefaultLang: () => {},
    use: () => {}
  };

  const files: FileHandle[] = [
    { url: 'http://', file: new File(['some content'], 'text-file.jpeg', { type: 'image/jpeg' }) },
    { url: 'http://', file: new File(['some content'], 'text-file.jpeg', { type: 'image/jpeg' }) }
  ];

  const dataFileMock = new File([''], 'test-file.jpeg');
  const event = { target: { files: [dataFileMock] } };

  const MatSnackBarMock = jasmine.createSpyObj('MatSnackBarComponent', ['openSnackBar']);
  MatSnackBarMock.openSnackBar = () => of();
  const eventsServiceMock = jasmine.createSpyObj('EventsService', ['getImageAsFile']);
  eventsServiceMock.getImageAsFile = () => of();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ImagesContainerComponent, TranslatePipeMock],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: MatSnackBarComponent, useValue: MatSnackBarMock },
        { provide: TranslateService, useValue: translateServiceMock },
        { provide: EventsService, useValue: eventsServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagesContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit expect chooseImage should be call', () => {
    component.images.length = 0;
    const spy = spyOn(component as any, 'chooseImage');
    component.ngOnInit();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should open snackbar when imageCount is 5', () => {
    component.imageCount = 5;
    const spy = spyOn((component as any).snackBar, 'openSnackBar');
    component.chooseImage('test.jpg');
    expect(spy).toHaveBeenCalledWith('errorMaxPhotos');
  });

  it('filesDropped expect transferFile should be called once', () => {
    const spy1 = spyOn(component as any, 'validateImage');
    (component as any).filesDropped(files);
    expect(spy1).toHaveBeenCalledTimes(1);
  });

  it('loadFile expect  transferFile should be called ', () => {
    const validateImageSpy = spyOn(component as any, 'validateImage');
    component.loadFile(event as any);
    expect(validateImageSpy).toHaveBeenCalled();
  });
});
