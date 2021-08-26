import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { CreateEcoNewsService } from './create-eco-news.service';

describe('CreateEcoNewsService', () => {
  let service: CreateEcoNewsService;
  let httpTestingController: HttpTestingController;
  const form = new FormGroup({
    title: new FormControl('mock news'),
    content: new FormControl('This is mock news content Greencity!!!!!!!!!!!!'),
    tags: new FormArray([new FormControl('News'), new FormControl('Ads')]),
    image: new FormControl(''),
    source: new FormControl('http://mocknews.com')
  });

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CreateEcoNewsService]
    })
  );

  beforeEach(() => {
    service = TestBed.inject(CreateEcoNewsService);
    httpTestingController = TestBed.inject(HttpTestingController);
    service.files[0] = { file: null, url: 'http://someimage' };
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set newsId', () => {
    const id = '11';
    service.setNewsId(id);
    expect(service.newsId).toEqual(id);
  });

  it('should return formData', () => {
    service.currentForm = new FormGroup({});
    expect(service.getFormData().value).toEqual(service.currentForm.value);
  });

  it('should return newsId', () => {
    service.newsId = '1555';
    expect(service.getNewsId()).toEqual(service.newsId);
  });

  it('should set current form using setForm method', () => {
    service.setForm(form);
    expect(service.currentForm).toEqual(form);
  });

  it('should set image value to empty string', () => {
    service.files[0] = null;
    service.setForm(form);
    expect(service.currentForm.value.image).toEqual('');
  });

  it('should make POST request', () => {
    service.sendFormData(form).subscribe((newsData) => {
      expect(newsData.title).toEqual('mock news');
    });

    const req = httpTestingController.expectOne('https://greencity.azurewebsites.net/econews');
    expect(req.request.method).toEqual('POST');
    req.flush(form.value);
  });

  it('should make PUT request', () => {
    service.editNews(form).subscribe((newsData) => {
      expect(newsData.tags[0]).toEqual('News');
    });

    const req = httpTestingController.expectOne('https://greencity.azurewebsites.net/econews/update');
    expect(req.request.method).toEqual('PUT');
    req.flush(form.value);
  });
});
