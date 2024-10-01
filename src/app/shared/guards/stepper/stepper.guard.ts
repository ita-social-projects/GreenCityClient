import { PlatformLocation } from '@angular/common';
import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take, tap } from 'rxjs';
import { SetCurrentStep } from 'src/app/store/actions/order.actions';
import { currentStepSelector } from 'src/app/store/selectors/order.selectors';

export const stepperGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const platformLocation = inject(PlatformLocation);

  let isBackNavigation = false;

  platformLocation.onPopState(() => {
    isBackNavigation = true;
  });

  return store.select(currentStepSelector).pipe(
    take(1),
    tap((step: number) => {
      if (isBackNavigation && step >= 1) {
        history.pushState(null, '');
        store.dispatch(SetCurrentStep({ step: step - 1 }));
      }
    }),
    map((step) => (isBackNavigation ? step === 0 : true))
  );
};
