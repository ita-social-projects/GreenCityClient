import { AgmCoreModule } from '@agm/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  MatLegacyDialogModule as MatDialogModule,
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA
} from '@angular/material/legacy-dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { MapEventComponent } from './map-event.component';

describe('MapEventComponent', () => {
  let component: MapEventComponent;
  let fixture: ComponentFixture<MapEventComponent>;

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
      imports: [TranslateModule.forRoot(), RouterTestingModule, MatDialogModule, AgmCoreModule.forRoot()],
      providers: [
        { provide: MatDialogRef, useValue: MatDialogMock },
        { provide: MAT_DIALOG_DATA, useValue: matDialogDataMock }
      ],
      declarations: [MapEventComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit data.lat should change', () => {
    spyOn((component as any).matDialogRef, 'backdropClick').and.returnValue(of());
    component.data.lat = 20;
    component.data.lng = 20;
    component.eventPlace.animation = '';
    component.ngOnInit();
    expect(component.eventPlace.location.lat).toBe(20);
    expect(component.eventPlace.location.lng).toBe(20);
    expect(component.eventPlace.animation).toBe('DROP');
    expect((component as any).matDialogRef.backdropClick).toHaveBeenCalled();
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

  it('closeMap expect matDialogRef close have been called', () => {
    spyOn((component as any).matDialogRef, 'close');
    component.closeMap();
    expect((component as any).matDialogRef.close).toHaveBeenCalledTimes(1);
  });
});
