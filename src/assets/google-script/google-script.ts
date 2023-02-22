import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GoogleScript {
  url = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB3xs7Kczo46LFcQRFKPMdrE0lU4qsR_S4&callback=initMap&libraries=places&language=`;

  load(lang: string): void {
    const googleScript: HTMLScriptElement = document.querySelector('#googleMaps');

    if (googleScript) {
      googleScript.src = this.url + lang;
    }
    if (!googleScript) {
      this.initMap();
      const google = document.createElement('script');
      google.type = 'text/javascript';
      google.id = 'googleMaps';
      google.setAttribute('src', this.url + lang);
      document.getElementsByTagName('head')[0].appendChild(google);
    }
  }

  initMap(): void {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.id = 'initMap';
    script.innerHTML = `function initMap() {}`;
    document.getElementsByTagName('head')[0].appendChild(script);
  }
}
