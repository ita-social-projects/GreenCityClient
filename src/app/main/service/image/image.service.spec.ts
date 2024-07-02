import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ImageService } from './image.service';
import { FileHandle } from '@eco-news-models/create-news-interface';
import { of } from 'rxjs';

describe('ImageService', () => {
  let service: ImageService;
  let httpTestingController: HttpTestingController;
  const url = 'http://test';
  const type = 'image/jpeg';
  const filename = 'text-file.jpeg';
  const blob = new Blob(['some content'], { type: type });
  const file = new File([blob], filename, { type: type });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ImageService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load image as file', () => {
    service.loadImageAsFile(url, type).subscribe((value) => {
      expect(value).toEqual(file);
    });

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush(blob);
    httpTestingController.verify();
  });

  it('should create a FileHandle from an image URL', (done) => {
    const spyOnLoadImageAsFile = spyOn(service, 'loadImageAsFile').and.returnValue(of(file));
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64data = reader.result as string;
      service.createFileHandle(url, type).subscribe((fileHandle: FileHandle) => {
        expect(spyOnLoadImageAsFile).toHaveBeenCalled();
        expect(fileHandle.file).toEqual(file);
        expect(fileHandle.url).toEqual(base64data);
        done();
      });
    };
  });
});
