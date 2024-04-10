import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeocoderService {
  constructor(private http: HttpClient) {}

  private resultSubject = new Subject<Observable<google.maps.GeocoderResult[]>>();

  geocodeLatLng(coordinates: google.maps.LatLngLiteral): Observable<google.maps.GeocoderResult[]> {
    // TODO REJECT
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

  changeAddress(coordinates: google.maps.LatLngLiteral) {
    this.resultSubject.next(this.geocodeLatLng(coordinates));
  }

  get $geocoderResult(): Observable<google.maps.GeocoderResult[]> {
    return this.resultSubject.asObservable().pipe(
      switchMap((value) => {
        return value;
      })
    );
  }
}
