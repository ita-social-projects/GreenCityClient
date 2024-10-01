import { ComponentFixture, fakeAsync, flush, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { ImagesContainerComponent } from './images-container.component';
import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { FileHandle } from '@ubs/ubs-admin/models/file-handle.model';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EventsService } from 'src/app/main/component/events/services/events.service';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

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
        { provide: EventsService, useValue: eventsServiceMock },
        { provide: MatDialog, useValue: {} }
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
});
