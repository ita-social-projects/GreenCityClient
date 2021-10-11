import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { UbsMainPageComponent } from '../../ubs-main-page/ubs-main-page.component';
import { UbsOrderLocationPopupComponent } from './ubs-order-location-popup.component';

describe('UbsOrderLocationPopupComponent', () => {
  let component: UbsOrderLocationPopupComponent;
  let fixture: ComponentFixture<UbsOrderLocationPopupComponent>;
  const dialogMock = { close: () => {} };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsOrderLocationPopupComponent],
      providers: [{ provide: MatDialogRef, useValue: dialogMock }],
      imports: [
        RouterTestingModule.withRoutes([{ path: 'ubs', component: UbsMainPageComponent }]),
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ]
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

  it('method redirectToMain should redirect to [ubs] ', () => {
    const routerstub: Router = TestBed.inject(Router);
    spyOn(routerstub, 'navigate');
    component.redirectToMain();
    expect(routerstub.navigate).toHaveBeenCalledWith(['ubs']);
  });

  it('destroy Subject should be closed after ngOnDestroy()', () => {
    // @ts-ignore
    component.destroy$ = new Subject<boolean>();
    // @ts-ignore
    spyOn(component.destroy$, 'complete');
    component.ngOnDestroy();
    // @ts-ignore
    expect(component.destroy$.complete).toHaveBeenCalledTimes(1);
  });
});
