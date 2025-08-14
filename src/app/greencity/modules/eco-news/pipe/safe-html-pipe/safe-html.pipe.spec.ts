import { TestBed } from '@angular/core/testing';
import { SafeHtmlPipe } from './safe-html.pipe';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

class MockDomSanitizer {
  bypassSecurityTrustHtml(value: string): SafeHtml {
    return value as SafeHtml;
  }
}

describe('SafeHtmlPipe', () => {
  let pipe: SafeHtmlPipe;
  let sanitizer: MockDomSanitizer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SafeHtmlPipe, { provide: DomSanitizer, useClass: MockDomSanitizer }]
    });
    pipe = TestBed.inject(SafeHtmlPipe);
    sanitizer = TestBed.inject(DomSanitizer) as unknown as MockDomSanitizer;
  });

  it('should create an instance of the pipe', () => {
    expect(pipe).toBeTruthy();
  });

  it('should call bypassSecurityTrustHtml with the provided value', () => {
    const html = '<h1>Test Heading</h1><p>Some content</p>';
    const sanitizerSpy = spyOn(sanitizer, 'bypassSecurityTrustHtml').and.callThrough();
    const result = pipe.transform(html);

    expect(sanitizerSpy).toHaveBeenCalledWith(html);
    expect(result).toBe(html as SafeHtml);
  });

  it('should handle an empty string gracefully', () => {
    const html = '';
    const sanitizerSpy = spyOn(sanitizer, 'bypassSecurityTrustHtml').and.callThrough();
    const result = pipe.transform(html);

    expect(sanitizerSpy).toHaveBeenCalledWith(html);
    expect(result).toBe(html as SafeHtml);
  });

  it('should handle a null or undefined value without errors', () => {
    const html = null;
    const sanitizerSpy = spyOn(sanitizer, 'bypassSecurityTrustHtml').and.callThrough();
    const result = pipe.transform(html);

    expect(sanitizerSpy).toHaveBeenCalledWith(html);
    expect(result).toBe(html as SafeHtml);
  });
});
