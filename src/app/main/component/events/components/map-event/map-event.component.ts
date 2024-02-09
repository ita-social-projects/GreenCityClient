import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Coords, MapMarker as MapMarkerInterface } from '../../models/events.interface';

@Component({
  selector: 'app-map-event',
  templateUrl: './map-event.component.html',
  styleUrls: ['./map-event.component.scss']
})
export class MapEventComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>();
  private map: any;

  public eventPlace: MapMarkerInterface;
  public adress: string;
  public markerContent = 'Event Address';
  public mapDeactivate: boolean;

  @Output() location = new EventEmitter<Coords>();

  regionOptions = {
    types: ['(regions)'],
    componentRestrictions: { country: 'UA' }
  };

  constructor(
    private matDialogRef: MatDialogRef<MapEventComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {
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
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.matDialogRef.close();
      });
  }

  public onMapReady(map: any): void {
    this.map = map;
    if (this.data.lat) {
      this.map.setCenter({
        lat: this.data.lat,
        lng: this.data.lng
      });
    }
  }

  public markerOver(marker: MapMarkerInterface): void {
    marker.animation = 'BOUNCE';
  }
  public markerOut(marker: MapMarkerInterface): void {
    marker.animation = '';
  }

  public closeMap(): void {
    this.matDialogRef.close();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
