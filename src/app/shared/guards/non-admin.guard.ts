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
  return store.pipe(
    select(userRoleSelector),
    take(1),
    tap((userRole) => {
      const isExempt = exemptRoutes.includes(state.url);
      if (!userRole && isExempt) {
        router.navigate(['/']);
      }
      if (userRole === adminRoleValue && !isExempt) {
        router.navigate(['/ubs/admin/orders']);
      }
    }),
    map((userRole) => {
      if (userRole === adminRoleValue && !exemptRoutes.includes(state.url)) {
        return false;
      }
      return true;
    })
  );
};
