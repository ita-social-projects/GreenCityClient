import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TUserRole } from 'src/app/shared/models/auth/user-role.type';
import { select, Store } from '@ngrx/store';
import { take, map, tap } from 'rxjs';
import { userRoleSelector } from 'src/app/store/selectors/auth.selectors';

export const NonAdminGuard: CanActivateFn = (route, state) => {
  const store: Store = inject(Store);
  const router: Router = inject(Router);

  const adminRoleValue: TUserRole = 'ROLE_UBS_EMPLOYEE';
  const exemptRoutes = ['/chat-page'];

  const pathOnly = state.url.split('?')[0].split('#')[0];
  return store.pipe(
    select(userRoleSelector),
    take(1),
    tap((userRole) => {
      const isExempt = exemptRoutes.includes(pathOnly);

      if (!userRole && isExempt) {
        router.navigate(['/']);
      }
      if (userRole === adminRoleValue && !isExempt) {
        router.navigate(['/ubs/admin/orders']);
      }
    }),
    map((userRole) => {
      const isExempt = exemptRoutes.includes(pathOnly);
      if (userRole === adminRoleValue && !isExempt) {
        return false;
      }
      return true;
    })
  );
};
