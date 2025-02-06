import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Coords, MapMarker as MapMarkerInterface } from '../../models/events.interface';
import { GoogleScript } from '@assets/google-script/google-script';

@Component({
  selector: 'app-map-event',
  templateUrl: './map-event.component.html',
  styleUrls: ['./map-event.component.scss']
})
export class MapEventComponent implements OnInit, OnDestroy {
  private $destroy: Subject<boolean> = new Subject<boolean>();
  private map: google.maps.Map;

  eventPlace: MapMarkerInterface;
  adress: string;
  markerContent = 'Event Address';
  mapDeactivate: boolean;
  isRenderingMap: boolean;
  @Output() location = new EventEmitter<Coords>();

  regionOptions = {
    types: ['(regions)'],
    componentRestrictions: { country: 'UA' }
  };

  constructor(
    private matDialogRef: MatDialogRef<MapEventComponent>,
    private googleScript: GoogleScript,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {
    this.googleScript.$isRenderingMap.pipe(takeUntil(this.$destroy)).subscribe((value: boolean) => {
      setTimeout(() => {
        this.isRenderingMap = value;
      }, 1000);
    });
    this.adress = this.data.address;
    this.eventPlace = {
      location: {
        lat: this.data.lat,
        lng: this.data.lng
      },
      animation: 'DROP'
    };
    this.matDialogRef
      .backdropClick()
      .pipe(takeUntil(this.$destroy))
      .subscribe(() => {
        this.matDialogRef.close();
      });
  }

  onMapReady(map: any): void {
    this.map = map;
    if (this.data.lat) {
      this.map.setCenter({
        lat: this.data.lat,
        lng: this.data.lng
      });
    }
  }

  markerOver(marker: MapMarkerInterface): void {
    marker.animation = 'BOUNCE';
  }
  markerOut(marker: MapMarkerInterface): void {
    marker.animation = '';
  }

  closeMap(): void {
    this.matDialogRef.close();
  }

  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.complete();
  }
}
