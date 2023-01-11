import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GoogleScript {
  mainUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyB3xs7Kczo46LFcQRFKPMdrE0lU4qsR_S4&libraries=places&language=';

  load(lang: string): void {
    const googleScript: HTMLScriptElement = document.querySelector('#googleMaps');

    if (googleScript) {
      googleScript.src = this.mainUrl + lang;
    }
    if (!googleScript) {
      const google = document.createElement('script');
      google.type = 'text/javascript';
      google.id = 'googleMaps';
      google.setAttribute('src', this.mainUrl + lang);
      document.getElementsByTagName('head')[0].appendChild(google);
    }
  }
}
