import { TestBed } from '@angular/core/testing';
import { GoogleScript } from '../google-script/google-script';
import { environment } from '@environment/environment';

describe('GoogleScript', () => {
  let googleScript;
  const apiMapKey = environment.apiMapKey;

  const url = `https://maps.googleapis.com/maps/api/js?key=${apiMapKey}&callback=initMap&libraries=places`;

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
    const script = document.querySelector('#googleMaps') as HTMLScriptElement;
    if (script) {
      script.remove();
    }
    const spy = spyOn(googleScript, 'initMap');
    googleScript.load('ua');
    const result = document.querySelector('#googleMaps') as HTMLScriptElement;
    expect(result).toBeDefined();
    expect(result.src).toBe(url);
    expect(result.type).toBe('text/javascript');
    expect(spy).toHaveBeenCalled();
  });

  it('method initMap add script tag', () => {
    googleScript.initMap();
    const result = document.querySelector('#initMap') as HTMLScriptElement;
    expect(result).toBeDefined();
    expect(result.type).toBe('text/javascript');
  });
});
