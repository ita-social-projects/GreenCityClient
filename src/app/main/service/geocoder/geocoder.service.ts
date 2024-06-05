import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeocoderService {
  constructor() {}

  geocodeLatLng(coordinates: google.maps.LatLngLiteral): Observable<google.maps.GeocoderResult[]> {
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

  changeAddress(coordinates: google.maps.LatLngLiteral): Observable<google.maps.GeocoderResult> {
    return this.geocodeLatLng(coordinates).pipe(
      switchMap((value) => value),
      take(1)
    );
  }
}
