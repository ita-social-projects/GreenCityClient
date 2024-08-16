import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take, tap } from 'rxjs';
import { SetCurrentStep } from 'src/app/store/actions/order.actions';
import { currentStepSelector } from 'src/app/store/selectors/order.selectors';

export const stepperGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);

  return store.select(currentStepSelector).pipe(
    take(1),
    tap((step: number) => {
      if (step >= 1) {
        history.pushState(null, '');
        store.dispatch(SetCurrentStep({ step: step - 1 }));
      }
    }),
    map((step) => step === 0)
  );
};
