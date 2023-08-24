import { TestBed } from '@angular/core/testing';
import { EventDescriptionTransformPipe } from './event-description-transform.pipe';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

describe('EventDescriptionTransformPipe', () => {
  let pipe: EventDescriptionTransformPipe;
  let sanitizer: DomSanitizer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: DomSanitizer, useValue: { sanitize: () => 'safeString', bypassSecurityTrustHtml: () => 'safeString' } }]
    });

    pipe = new EventDescriptionTransformPipe(TestBed.inject(DomSanitizer));
    sanitizer = TestBed.inject(DomSanitizer);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform HTML content', () => {
    const htmlContent = '<p>Hello, <strong>World</strong></p>';
    const sanitizedHtml = sanitizer.bypassSecurityTrustHtml(htmlContent);
    const transformedHtml = pipe.transform(htmlContent);
    expect(transformedHtml).toEqual(sanitizedHtml);
  });
});
