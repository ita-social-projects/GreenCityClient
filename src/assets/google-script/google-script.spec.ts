import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NgZone } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from '@environment/environment';
import { GoogleScript } from '@assets/google-script/google-script';

declare global {
  interface Window {
    google: any;
    initMap: (() => void) | undefined;
  }
}

const mockEnvironment = {
  apiMapKey: environment.apiMapKey
};

describe('GoogleScript', () => {
  let service: GoogleScript;
  let ngZone: NgZone;
  let mockScript: HTMLScriptElement;
  let scriptLoadCallback: () => void;
  let scriptErrorCallback: (event: Event | string) => void;

  let mockWindowGoogle: any;

  beforeAll(() => {
    Object.defineProperty(window, 'google', {
      writable: true,
      configurable: true,
      value: undefined
    });
    Object.defineProperty(window, 'initMap', {
      writable: true,
      configurable: true,
      value: undefined
    });
  });

  beforeEach(() => {
    mockWindowGoogle = undefined;
    window.google = mockWindowGoogle;
    window.initMap = undefined;

    mockScript = {
      id: '',
      src: '',
      async: false,
      defer: false,
      onload: null,
      onerror: null,
      remove: jasmine.createSpy('remove')
    } as any;

    spyOn(document, 'createElement').and.returnValue(mockScript);
    spyOn(document.head, 'appendChild');
    spyOn(document, 'getElementById').and.callFake((id: string) => {
      if (id === 'google-maps-script' && mockScript.id === 'google-maps-script') {
        return mockScript;
      }
      return null;
    });

    TestBed.configureTestingModule({
      providers: [
        GoogleScript,
        {
          provide: NgZone,
          useValue: {
            // eslint-disable-next-line @typescript-eslint/ban-types
            runOutsideAngular: (fn: Function) => fn(),
            onStable: new Subject<any>(),
            onMicrotaskEmpty: new Subject<any>()
          }
        }
      ]
    });

    service = TestBed.inject(GoogleScript);
    ngZone = TestBed.inject(NgZone);

    Object.defineProperty(mockScript, 'onload', {
      set: (fn: any) => {
        scriptLoadCallback = fn;
      },
      get: () => scriptLoadCallback
    });
    Object.defineProperty(mockScript, 'onerror', {
      set: (fn: any) => {
        scriptErrorCallback = fn;
      },
      get: () => scriptErrorCallback
    });

    (service as any)['scriptLoaded'] = false;
    (service as any)['currentLanguage'] = null;
    (service as any)['mapReadySubject'] = new BehaviorSubject<boolean>(false);
    (service as any)['loadMutex'] = null;
    (service as any)['lastLanguage'] = null;
    service.mapReady = (service as any)['mapReadySubject'].asObservable();
  });

  afterEach(() => {
    mockWindowGoogle = undefined;
    window.google = undefined;
    window.initMap = undefined;

    if ((document.head.appendChild as jasmine.Spy).calls.any()) {
      mockScript.remove();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('_isApiInitialized', () => {
    it('should return true if window.google.maps.places is defined', () => {
      window.google = { maps: { places: {} } };
      expect((service as any)._isApiInitialized()).toBeTrue();
    });

    it('should return false if window.google is undefined', () => {
      window.google = undefined;
      expect((service as any)._isApiInitialized()).toBeFalse();
    });

    it('should return false if window.google.maps is undefined', () => {
      window.google = { maps: undefined };
      expect((service as any)._isApiInitialized()).toBeFalse();
    });

    it('should return false if window.google.maps.places is undefined', () => {
      window.google = { maps: {} };
      expect((service as any)._isApiInitialized()).toBeFalse();
    });
  });

  describe('constructor', () => {
    it('should set window.initMap and emit true when API is initialized and language is set', fakeAsync(() => {
      window.google = { maps: { places: {} } };
      service = TestBed.inject(GoogleScript);

      let mapReadyStatus: boolean | undefined;
      service.mapReady.subscribe((status) => (mapReadyStatus = status));

      (service as any)['currentLanguage'] = 'en';

      expect(typeof window.initMap).toBe('function');
      if (window.initMap) {
        window.initMap();
      }
      tick();

      expect(mapReadyStatus).toBeTrue();
    }));

    it('should not emit true if API is not initialized', fakeAsync(() => {
      window.google = undefined;

      service = TestBed.inject(GoogleScript);

      let mapReadyStatus: boolean | undefined;
      service.mapReady.subscribe((status) => (mapReadyStatus = status));

      (service as any)['currentLanguage'] = 'en';

      if (window.initMap) {
        window.initMap();
      }
      tick();

      expect(mapReadyStatus).toBeFalse();
    }));

    it('should not emit true if currentLanguage is null', fakeAsync(() => {
      window.google = { maps: { places: {} } };
      service = TestBed.inject(GoogleScript);

      let mapReadyStatus: boolean | undefined;
      service.mapReady.subscribe((status) => (mapReadyStatus = status));

      (service as any)['currentLanguage'] = null;

      if (window.initMap) {
        window.initMap();
      }
      tick();

      expect(mapReadyStatus).toBeFalse();
    }));
  });

  describe('load', () => {
    it('should resolve immediately if currentLanguage is null (initial state)', fakeAsync(() => {
      (service as any)['currentLanguage'] = null;
      const language = 'en';
      const loadPromise = service.load(language);

      expect(document.createElement).not.toHaveBeenCalled();
      expect(document.head.appendChild).not.toHaveBeenCalled();

      loadPromise
        .then(() => {
          expect((service as any)['currentLanguage']).toBe(language);
        })
        .catch(fail);

      tick();
    }));

    it('should resolve immediately if script is already loaded for the same language', fakeAsync(() => {
      (service as any)['scriptLoaded'] = true;
      (service as any)['currentLanguage'] = 'en';
      (service as any)['mapReadySubject'].next(true);
      (service as any)['lastLanguage'] = 'en';

      const loadPromise = service.load('en');

      expect(document.createElement).not.toHaveBeenCalled();
      expect(document.head.appendChild).not.toHaveBeenCalled();

      loadPromise
        .then(() => {
          expect(true).toBeTrue();
        })
        .catch(fail);

      tick();
    }));

    it('should remove existing script and load new one for different language', fakeAsync(() => {
      (service as any)['scriptLoaded'] = true;
      (service as any)['currentLanguage'] = 'en';
      (service as any)['mapReadySubject'].next(true);
      (service as any)['lastLanguage'] = 'en';

      mockScript.id = 'google-maps-script';
      (document.getElementById as jasmine.Spy).and.returnValue(mockScript);
      window.google = { maps: { places: {} } };

      const language = 'fr';
      const loadPromise = service.load(language);

      tick((service as any)['scriptRemovalDelayMs']);
      expect(mockScript.remove).toHaveBeenCalled();
      expect(window.google).toBeUndefined();

      tick((service as any)['cleanupDelayMs']);

      expect(document.createElement).toHaveBeenCalledTimes(1);
      expect(document.head.appendChild).toHaveBeenCalledTimes(1);
      expect(mockScript.src).toContain(`language=${language}`);

      scriptLoadCallback();
      tick();

      window.google = { maps: { places: {} } };
      if (window.initMap) {
        window.initMap();
      }
      tick();

      expect((service as any)['currentLanguage']).toBe(language);
      expect((service as any)['mapReadySubject'].value).toBeTrue();

      loadPromise
        .then(() => {
          expect(true).toBeTrue();
        })
        .catch(fail);

      tick();
    }));
  });

  describe('_removeGoogleScriptWithDelay', () => {
    it('should remove the script and clear window.google after delays if script exists', fakeAsync(() => {
      mockScript.id = 'google-maps-script';
      (document.getElementById as jasmine.Spy).and.returnValue(mockScript);
      window.google = { maps: { places: {} } };

      const removePromise = (service as any)._removeGoogleScriptWithDelay();

      expect(mockScript.remove).not.toHaveBeenCalled();
      expect(window.google).toBeDefined();

      tick((service as any)['scriptRemovalDelayMs']);

      expect(mockScript.remove).toHaveBeenCalledTimes(1);
      expect(window.google).toBeUndefined();

      tick((service as any)['cleanupDelayMs']);

      removePromise.then(() => expect(true).toBeTrue()).catch(fail);
      tick();
    }));

    it('should resolve immediately if no script exists', fakeAsync(() => {
      (document.getElementById as jasmine.Spy).and.returnValue(null);
      window.google = undefined;

      const removePromise = (service as any)._removeGoogleScriptWithDelay();

      expect(mockScript.remove).not.toHaveBeenCalled();
      expect(window.google).toBeUndefined();

      removePromise.then(() => expect(true).toBeTrue()).catch(fail);
      tick();
    }));
  });
});
