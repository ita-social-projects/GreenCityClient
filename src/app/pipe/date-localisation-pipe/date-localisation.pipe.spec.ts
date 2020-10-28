import { DateLocalisationPipe } from './date-localisation.pipe';
import { LocalStorageService } from '../../service/localstorage/local-storage.service';

describe('DateLocalisationPipe', () => {
  it('create an instance of pipe', () => {
    const localStorageService = new LocalStorageService();
    const pipe = new DateLocalisationPipe(localStorageService);
    expect(pipe).toBeTruthy();
  });
});
