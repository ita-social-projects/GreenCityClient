import { TestBed } from '@angular/core/testing';
import { GoogleScript } from '../google-script/google-script';
import { environment } from '@environment/environment';

declare global {
  interface Window {
    initMap?: () => void;
  }
}

describe('GoogleScript', () => {
  let googleScript: GoogleScript;
  const apiMapKey = environment.apiMapKey;
  const url = `https://maps.googleapis.com/maps/api/js?key=${apiMapKey}&callback=initMap&libraries=places`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [],
      imports: []
    });
    googleScript = TestBed.inject(GoogleScript);

    if (!window.initMap) {
      window.initMap = () => {
        new google.maps.Map(document.getElementById('map'), {
          center: { lat: -34.397, lng: 150.644 },
          zoom: 8
        });
      };
    }
  });

  it('should be created', () => {
    expect(googleScript).toBeTruthy();
  });

  it('method load should create and add script tag to HTML', () => {
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
    expect(window.initMap).toBeDefined();
    expect(spy).toHaveBeenCalled();
  });

  it('method initMap should add script tag', () => {
    googleScript.initMap();
    const result = document.querySelector('#initMap') as HTMLScriptElement;
    expect(result).toBeDefined();
    expect(result.type).toBe('text/javascript');
  });
});
