import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';

@Injectable({ providedIn: 'root' })
export class GoogleScript {
  apiMapKey = environment.apiMapKey;

  private languageDict = {
    ua: 'uk',
    en: 'en'
  };

  load(language: string): void {
    const googleScript: HTMLScriptElement = document.querySelector('#googleMaps');
    const url = this.getUrl({ key: this.apiMapKey, language });

    if (googleScript) {
      googleScript.src = url;
    }

    if (!googleScript) {
      this.initMap();
      const google = document.createElement('script');
      google.type = 'text/javascript';
      google.id = 'googleMaps';
      google.setAttribute('src', url);
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

  private getUrl({ key, language }: { key: string; language: string }): string {
    const mappedLanguage = this.languageDict[language] ?? language;
    return `https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap&libraries=places&language=${mappedLanguage}`;
  }
}
