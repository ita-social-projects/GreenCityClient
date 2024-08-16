import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TUserRole } from '@global-models/auth/user-role.type';
import { select, Store } from '@ngrx/store';
import { take, map, tap } from 'rxjs';
import { userRoleSelector } from 'src/app/store/selectors/auth.selectors';

export const NonAdminGuard: CanActivateFn = (route, state) => {
  const store: Store = inject(Store);
  const router: Router = inject(Router);

  const adminRoleValue: TUserRole = 'ROLE_UBS_EMPLOYEE';

  return store.pipe(
    select(userRoleSelector),
    take(1),
    tap((userRole) => userRole === adminRoleValue && router.navigate(['/ubs-admin/orders'])),
    map((userRole) => userRole !== adminRoleValue)
  );
};
