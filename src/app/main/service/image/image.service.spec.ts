import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ImageService } from './image.service';

describe('ImageService', () => {
  let service: ImageService;
  let httpTestingController: HttpTestingController;

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
    const url = 'http://test';
    const type = 'image/jpeg';
    const filename = 'text-file.jpeg';
    const blob = new Blob(['some content'], { type: type });
    const file = new File([blob], filename, { type: type });

    service.loadImageAsFile(url, type).subscribe((value) => {
      expect(value).toEqual(file);
    });

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush(blob);
    httpTestingController.verify();
  });
});
