import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { FilterLocationListByLangPipe } from './filter-location-list-by-lang.pipe';

describe('FilterLocationListByLangPipe', () => {
  let localStorageService: LocalStorageService;

  it('create an instance', () => {
    const pipe = new FilterLocationListByLangPipe(localStorageService);
    expect(pipe).toBeTruthy();
  });
});
