import { DateLocalisationPipe } from './date-localisation.pipe';

describe('DateLocalisationPipe', () => {
  it('create an instance of pipe', () => {
    const localStorageService = new LocalStorageService();
    const pipe = new DateLocalisationPipe(localStorageService);
    expect(pipe).toBeTruthy();
  });
});
