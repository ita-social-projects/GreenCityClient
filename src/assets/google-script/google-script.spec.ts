import { TestBed } from '@angular/core/testing';
import { GoogleScript } from '../google-script/google-script';

describe('GoogleScript', () => {
  let googleScript;

  const urlUa = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyB3xs7Kczo46LFcQRFKPMdrE0lU4qsR_S4&libraries=places&language=ua';
  const urlEn = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyB3xs7Kczo46LFcQRFKPMdrE0lU4qsR_S4&libraries=places&language=en';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [],
      imports: []
    });
    googleScript = TestBed.inject(GoogleScript);
  });

  it('should be created', () => {
    expect(googleScript).toBeTruthy();
  });

  it('method load create and add script tag to html ', () => {
    googleScript.load('ua');
    const result = document.querySelector('#googleMaps') as HTMLScriptElement;
    expect(result).toBeDefined();
    expect(result.src).toBe(urlUa);
    expect(result.type).toBe('text/javascript');
  });

  it('method load change src in script tag', () => {
    googleScript.load('ua');
    googleScript.load('en');
    const result = document.querySelector('#googleMaps') as HTMLScriptElement;
    expect(result.src).toBe(urlEn);
  });
});
