import { AgmCoreModule } from '@agm/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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

  beforeEach(async(() => {
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
    component.data.lat = 20;
    component.ngOnInit();
    expect(component.eventPlace.location.lat).toBe(20);
    component.data.lat = 10;
  });

  it('closeMap expect matDialogRef close have been called', () => {
    spyOn((component as any).matDialogRef, 'close');
    component.closeMap();
    expect((component as any).matDialogRef.close).toHaveBeenCalledTimes(1);
  });
});
