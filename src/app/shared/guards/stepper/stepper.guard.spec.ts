import { fakeAsync, flush, TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { isObservable, Observable } from 'rxjs';
import { currentStepSelector } from 'src/app/store/selectors/order.selectors';
import { stepperGuard } from './stepper.guard';
import { SetCurrentStep } from 'src/app/store/actions/order.actions';

describe('stepperGuard', () => {
  let store: MockStore;
  let mockCurrentStepSelector;
  let dispatchSpy;

  const route: ActivatedRouteSnapshot = {} as any;
  const state: RouterStateSnapshot = {} as any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [provideMockStore()]
    });

    store = TestBed.inject<any>(MockStore);

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

  it('should not allow deactivation if current step is 1', fakeAsync(() => {
    mockCurrentStepSelector.setResult(1);
    const result = TestBed.runInInjectionContext(() => stepperGuard(route, state));

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

  it('should not allow deactivation if current step is 2', fakeAsync(() => {
    mockCurrentStepSelector.setResult(2);
    const result = TestBed.runInInjectionContext(() => stepperGuard(route, state));

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
});
