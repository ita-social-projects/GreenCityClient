import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TUserRole } from '@global-models/auth/user-role.type';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { select, Store } from '@ngrx/store';
import { filter, map, take } from 'rxjs';
import { userRoleSelector } from 'src/app/store/selectors/auth.selectors';

export const UbsAdminGuard: CanActivateFn = (route, state) => {
  const store: Store = inject(Store);
  const localStorageService: LocalStorageService = inject(LocalStorageService);
  const router: Router = inject(Router);

  const adminRoleValue: TUserRole = 'ROLE_UBS_EMPLOYEE';

  if (!localStorageService.getAccessToken()) {
    if (route['path'].includes('ubs')) {
      return router.createUrlTree(['/ubs']);
    } else {
      return router.createUrlTree(['/greenCity']);
    }
  }

  return store.pipe(
    select(userRoleSelector),
    filter(Boolean),
    take(1),
    map((userRole) => userRole === adminRoleValue)
  );
};
