import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { FilterLocationListByLangPipe } from 'src/app/shared/filter-location-list-by-lang/filter-location-list-by-lang.pipe';
import { UbsOrderLocationPopupComponent } from './ubs-order-location-popup.component';

describe('UbsOrderLocationPopupComponent', () => {
  let component: UbsOrderLocationPopupComponent;
  let fixture: ComponentFixture<UbsOrderLocationPopupComponent>;
  const dialogMock = { close: () => {} };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsOrderLocationPopupComponent, FilterLocationListByLangPipe],
      providers: [{ provide: MatDialogRef, useValue: dialogMock }],
      imports: [HttpClientTestingModule, MatDialogModule, TranslateModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsOrderLocationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('method ngOnInit should invoke method getLocations()', () => {
    const spy = spyOn(component, 'getLocations').and.callFake(() => {});
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('method saveLocation should call by click save button', fakeAsync(() => {
    const spy = spyOn(component, 'saveLocation');
    const btn = fixture.debugElement.query(By.css('.primary-global-button'));
    btn.triggerEventHandler('click', null);
    tick();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  }));

  it('method ngOnDestroy should invoke method passDataToComponent()', () => {
    component.isSaveLocation = true;
    const spy = spyOn(component, 'passDataToComponent').and.callFake(() => {});
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });

  it('method passDataToComponent should invoke this.dialogRef.close({})', () => {
    // @ts-ignore
    spyOn(component.dialogRef, 'close');
    component.passDataToComponent();
    // @ts-ignore
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('method redirectToMain should call by click back button', fakeAsync(() => {
    const spyMethod = spyOn(component, 'redirectToMain');
    const btn = fixture.debugElement.query(By.css('.secondary-global-button'));
    btn.triggerEventHandler('click', null);
    tick();
    fixture.detectChanges();
    expect(spyMethod).toHaveBeenCalled();
  }));

  it('destroy Subject should be closed after ngOnDestroy()', () => {
    // @ts-ignore
    component.destroy$ = new Subject<boolean>();
    // @ts-ignore
    spyOn(component.destroy$, 'complete');
    component.ngOnDestroy();
    // @ts-ignore
    expect(component.destroy$.complete).toHaveBeenCalledTimes(1);
  });

  describe('displayFn', () => {
    it('makes expected calls', () => {
      const city = {
        locationId: 3,
        locationName: 'fakeName'
      };
      const res = component.displayFn(city);
      expect(res).toBe('fakeName');
    });

    it('makes expected calls if city is null', () => {
      const city = null;
      const res = component.displayFn(city);
      expect(res).toBe('');
    });
  });

  it('expected result in redirectToMain', () => {
    component.isSaveLocation = true;
    component.redirectToMain();
    expect(component.isSaveLocation).toBeFalsy();
  });

  it('expected result in changeLocation', () => {
    component.changeLocation(3);
    expect(component.selectedLocationId).toBe(3);
  });
});
