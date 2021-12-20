import { UrlHostnamePipe } from './url-hostname.pipe';

describe('WebpageHostnamePipe', () => {
  it('create an instance', () => {
    const pipe = new UrlHostnamePipe();
    expect(pipe).toBeTruthy();
  });
});
