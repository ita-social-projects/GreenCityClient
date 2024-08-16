import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { TUserRole } from '@global-models/auth/user-role.type';
import { select, Store } from '@ngrx/store';
import { filter, map, take } from 'rxjs';
import { userRoleSelector } from 'src/app/store/selectors/auth.selectors';

export const UbsAdminGuard: CanActivateFn = (route, state) => {
  const store: Store = inject(Store);

  const adminRoleValue: TUserRole = 'ROLE_UBS_EMPLOYEE';

  return store.pipe(
    select(userRoleSelector),
    filter(Boolean),
    take(1),
    map((userRole) => userRole === adminRoleValue)
  );
};
