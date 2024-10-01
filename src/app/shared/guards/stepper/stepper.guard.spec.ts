import { TestBed, fakeAsync, flush } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, isObservable } from 'rxjs';
import { stepperGuard } from './stepper.guard';
import { currentStepSelector } from 'src/app/store/selectors/order.selectors';

import { SetCurrentStep } from 'src/app/store/actions/order.actions';
import { PlatformLocation } from '@angular/common';

describe('stepperGuard', () => {
  let store: MockStore;
  let mockCurrentStepSelector;
  let dispatchSpy;
  let platformLocation: PlatformLocation;
  let popStateCallback: () => void;

  const route: ActivatedRouteSnapshot = {} as any;
  const state: RouterStateSnapshot = {} as any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        provideMockStore(),
        {
          provide: PlatformLocation,
          useValue: {
            onPopState: (fn: () => void) => {
              popStateCallback = fn;
            }
          }
        }
      ]
    });

    store = TestBed.inject<any>(MockStore);
    platformLocation = TestBed.inject(PlatformLocation);
    mockCurrentStepSelector = store.overrideSelector(currentStepSelector, null);
    dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
  });

  it('should allow deactivation if current step is 0', fakeAsync(() => {
    mockCurrentStepSelector.setResult(0);
    const result = TestBed.runInInjectionContext(() => stepperGuard(route, state));

    flush();

    if (!isObservable(result)) {
      expect(result).toBeInstanceOf(Observable);
      return;
    }

    result.subscribe((value) => {
      expect(value).toBeTrue();
    });

    expect(dispatchSpy).not.toHaveBeenCalled();

    flush();
  }));

  it('should not allow deactivation if current step is 1 and back button is pressed', fakeAsync(() => {
    mockCurrentStepSelector.setResult(1);
    const result = TestBed.runInInjectionContext(() => stepperGuard(route, state));

    popStateCallback();

    flush();

    if (!isObservable(result)) {
      expect(result).toBeInstanceOf(Observable);
      return;
    }

    result.subscribe((value) => {
      expect(value).toBeFalse();
    });

    expect(dispatchSpy).toHaveBeenCalledOnceWith(SetCurrentStep({ step: 0 }));

    flush();
  }));

  it('should not allow deactivation if current step is 2 and back button is pressed', fakeAsync(() => {
    mockCurrentStepSelector.setResult(2);
    const result = TestBed.runInInjectionContext(() => stepperGuard(route, state));

    popStateCallback();

    flush();

    if (!isObservable(result)) {
      expect(result).toBeInstanceOf(Observable);
      return;
    }

    result.subscribe((value) => {
      expect(value).toBeFalse();
    });

    expect(dispatchSpy).toHaveBeenCalledOnceWith(SetCurrentStep({ step: 1 }));

    flush();
  }));

  it('should allow deactivation if navigation is not triggered by back button', fakeAsync(() => {
    mockCurrentStepSelector.setResult(1);
    const result = TestBed.runInInjectionContext(() => stepperGuard(route, state));

    flush();

    if (!isObservable(result)) {
      expect(result).toBeInstanceOf(Observable);
      return;
    }

    result.subscribe((value) => {
      expect(value).toBeTrue();
    });

    expect(dispatchSpy).not.toHaveBeenCalled();

    flush();
  }));
});
