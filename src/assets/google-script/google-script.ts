import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';

@Injectable({ providedIn: 'root' })
export class GoogleScript {
  apiMapKey = environment.apiMapKey;
  url = `https://maps.googleapis.com/maps/api/js?key=${this.apiMapKey}&callback=initMap&libraries=places`;

  load(lang: string): void {
    const googleScript: HTMLScriptElement = document.querySelector('#googleMaps');

    if (googleScript) {
      googleScript.src = this.url;
    } else {
      this.initMap();
      const google = document.createElement('script');
      google.type = 'text/javascript';
      google.id = 'googleMaps';
      google.async = true;
      google.defer = true;
      google.src = this.url;
      googleScript.onerror = () => console.error('Google Maps script could not be loaded.');
      document.head.appendChild(googleScript);
    }
  }

  initMap(): void {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.id = 'initMap';
    script.innerHTML = `function initMap() {}`;
    document.head.appendChild(script);
  }
}
