import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { MapEventComponent } from './map-event.component';
import { GoogleMapsModule } from '@angular/google-maps';

describe('MapEventComponent', () => {
  let component: MapEventComponent;
  let fixture: ComponentFixture<MapEventComponent>;

  let google;
  const originalGoogle = (window as any).google;

  const MatDialogMock = jasmine.createSpyObj('MatDialogRef', ['close', 'backdropClick']);
  MatDialogMock.close = () => 'Close the window please';
  MatDialogMock.backdropClick = () => of(true);

  const matDialogDataMock = {
    lat: 10,
    lng: 10
  };

  const MarkerMock = {
    location: {
      lat: 5,
      lng: 5
    },
    animation: ''
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, MatDialogModule, GoogleMapsModule],
      providers: [
        { provide: MatDialogRef, useValue: MatDialogMock },
        { provide: MAT_DIALOG_DATA, useValue: matDialogDataMock }
      ],
      declarations: [MapEventComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    (window as any).google = {
      maps: {
        Map: jasmine.createSpy('Map').and.returnValue({
          setCenter: jasmine.createSpy('setCenter'),
          setZoom: jasmine.createSpy('setZoom')
        }),
        Marker: jasmine.createSpy('Marker').and.returnValue({
          setMap: jasmine.createSpy('setMap'),
          setPosition: jasmine.createSpy('setPosition'),
          addListener: jasmine.createSpy('addListener'),
          setAnimation: jasmine.createSpy('setAnimation')
        }),
        LatLng: jasmine.createSpy('LatLng').and.returnValue({
          lat: 10,
          lng: 10
        })
      }
    };

    fixture = TestBed.createComponent(MapEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    (window as any).google = originalGoogle;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit data.lat should change', () => {
    component.data.lat = 20;
    component.data.lng = 20;
    component.eventPlace.animation = '';
    component.ngOnInit();
    expect(component.eventPlace.location.lat).toBe(20);
    expect(component.eventPlace.location.lng).toBe(20);
    expect(component.eventPlace.animation).toBe('DROP');
    component.data.lat = 10;
    component.data.lng = 10;
  });

  it('markerOver expect marker animation to be BOUNCE', () => {
    component.markerOver(MarkerMock);
    expect(MarkerMock.animation).toBe('BOUNCE');
  });

  it('markerOut expect marker animation to be empty', () => {
    component.markerOut(MarkerMock);
    expect(MarkerMock.animation).toBe('');
  });
});
