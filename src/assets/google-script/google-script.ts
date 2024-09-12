import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GoogleScript {
  apiMapKey = environment.apiMapKey;
  prevLang: string;
  $isRenderingMap: Subject<boolean> = new Subject();

  constructor() {}
  load(lang): void {
    const googleScript: HTMLScriptElement = document.querySelector('#googleMaps');
    // eslint-disable-next-line max-len
    const url = `https://maps.googleapis.com/maps/api/js?key=${this.apiMapKey}&callback=initMap&libraries=places&language=${lang}&loading=async`;
    if (googleScript) {
      if (this.prevLang !== lang) {
        this.$isRenderingMap.next(true);
        googleScript.remove();
        delete (window as any).google;
      } else {
        return;
      }
    }

    this.initMap(lang);
    const google = document.createElement('script');
    google.type = 'text/javascript';
    google.id = 'googleMaps';
    google.setAttribute('src', url);
    document.getElementsByTagName('head')[0].appendChild(google);
    this.prevLang = lang;
    this.$isRenderingMap.next(false);
  }

  initMap(lang): void {
    const initMap = document.querySelector('#initMap');
    if (initMap) {
      if (this.prevLang !== lang) {
        initMap.remove();
      } else {
        return;
      }
    }
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.id = 'initMap';
    script.innerHTML = `function initMap() {}`;
    document.head.appendChild(script);
  }
}
