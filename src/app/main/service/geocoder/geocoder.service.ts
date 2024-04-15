import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeocoderService {
  public subjectsMap = new Map<any, Subject<Observable<google.maps.GeocoderResult[]>>>();

  constructor() {}

  $getGeocoderResult(key: any): Observable<google.maps.GeocoderResult[]> {
    if (this.subjectsMap.has(key)) {
      return this.subjectsMap.get(key).pipe(switchMap((value) => value));
    }
    this.subjectsMap.set(key, new Subject<Observable<google.maps.GeocoderResult[]>>());
    return this.subjectsMap
      .get(key)
      .asObservable()
      .pipe(switchMap((value) => value));
  }

  geocodeLatLng(coordinates: google.maps.LatLngLiteral): Observable<google.maps.GeocoderResult[]> {
    // TODO ERROR
    const geocoder = new google.maps.Geocoder();
    return new Observable((observer) => {
      geocoder.geocode({ location: coordinates }, (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
        if (status === 'OK') {
          observer.next(results);
        } else {
          observer.error('Error in google maps geo');
        }
        observer.complete(); // Assuming no further emissions
      });
    });
  }

  changeAddress(coordinates: google.maps.LatLngLiteral, key: any) {
    this.subjectsMap.get(key).next(this.geocodeLatLng(coordinates));
  }
}
