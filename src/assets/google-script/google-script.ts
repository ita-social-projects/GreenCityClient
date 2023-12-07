import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';

@Injectable({ providedIn: 'root' })
export class GoogleScript {
  apiMapKey = environment.apiMapKey;
  url = `https://maps.googleapis.com/maps/api/js?key=${this.apiMapKey}&callback=initMap&libraries=places&language=`;

  load(lang: string): void {
    console.log('hereeeeeeeeeeeeeeee', lang);
    const googleScript: HTMLScriptElement = document.querySelector('#googleMaps');

    if (googleScript) {
      console.log('heree', googleScript);
      googleScript.src = this.url + lang;
    }
    if (!googleScript) {
      console.log('heree', googleScript);
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
