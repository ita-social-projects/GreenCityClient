import { Injectable, NgZone } from '@angular/core';
import { environment } from '@environment/environment';
import { BehaviorSubject, filter, take, firstValueFrom } from 'rxjs';

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

@Injectable({
  providedIn: 'root'
})
export class GoogleScript {
  private readonly apiKey = environment.apiMapKey;
  private scriptLoaded = false;
  private currentLanguage: string | null = null;
  private readonly mapReadySubject = new BehaviorSubject<boolean>(false);
  private loadMutex: Promise<void> | null = null;
  private lastLanguage: string | null = null;
  public mapReady = this.mapReadySubject.asObservable();

  private readonly scriptRemovalDelayMs = 50;
  private readonly cleanupDelayMs = 500;

  constructor(private readonly ngZone: NgZone) {
    window.initMap = () =>
      this.ngZone.runOutsideAngular(() => {
        if (this._isApiInitialized() && this.currentLanguage) {
          this.mapReadySubject.next(true);
        }
      });
  }

  private _isApiInitialized(): boolean {
    return typeof window?.google?.maps?.places !== 'undefined';
  }

  public async load(language: string): Promise<void> {
    if (!this.currentLanguage) {
      this.currentLanguage = language;
      return Promise.resolve();
    }

    if (this.currentLanguage === language && this.lastLanguage) {
      return Promise.resolve();
    }

    if (this.scriptLoaded && this.currentLanguage === language && this.mapReadySubject.value) {
      return Promise.resolve();
    }

    // eslint-disable-next-line
    if (!!this.loadMutex) {
      if (this.currentLanguage === language && this.currentLanguage) {
        return this.loadMutex;
      } else if (this.currentLanguage) {
        await this.loadMutex;
        return Promise.resolve();
      }
    }

    this.mapReadySubject.next(false);
    this.scriptLoaded = false;
    this.lastLanguage = this.currentLanguage;
    this.currentLanguage = language;

    // eslint-disable-next-line no-async-promise-executor
    this.loadMutex = new Promise<void>(async (resolve, reject) => {
      try {
        await this._removeGoogleScriptWithDelay();

        const script = document.createElement('script');
        script.id = 'google-maps-script';
        // eslint-disable-next-line max-len
        script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&callback=initMap&libraries=places&language=${language}&loading=async`;
        script.async = true;
        script.defer = true;

        const scriptLoadPromise = new Promise<void>((scriptResolve, scriptReject) => {
          script.onload = () => {
            scriptResolve();
          };

          script.onerror = (error) => {
            this.scriptLoaded = false;
            this.mapReadySubject.next(false);
            this.currentLanguage = null;
            scriptReject(new Error('Google Maps API script failed to load.'));
          };
        });

        document.head.appendChild(script);

        await scriptLoadPromise;

        await firstValueFrom(
          this.mapReady.pipe(
            filter((ready) => ready),
            take(1)
          )
        );

        resolve();
      } catch (error) {
        this.mapReadySubject.next(false);
        this.scriptLoaded = false;
        this.currentLanguage = null;
        reject(error);
      } finally {
        this.loadMutex = null;
      }
    });

    return this.loadMutex;
  }

  private _removeGoogleScriptWithDelay(): Promise<void> {
    return new Promise((resolve) => {
      const existingScript = document.getElementById('google-maps-script');
      if (existingScript) {
        setTimeout(() => {
          existingScript.remove();

          try {
            if (window?.google?.maps) {
              delete window.google.maps;
              delete window.google;
            }
          } catch (e) {
            console.log('GoogleScript: Error clearing global google object:', e);
          }

          setTimeout(() => {
            resolve();
          }, this.cleanupDelayMs);
        }, this.scriptRemovalDelayMs);
      } else {
        resolve();
      }
    });
  }
}
