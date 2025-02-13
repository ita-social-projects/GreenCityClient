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
  return store.pipe(
    select(userRoleSelector),
    take(1),
    tap((userRole) => userRole === adminRoleValue && router.navigate(['/ubs/admin/orders'])),
    map((userRole) => userRole !== adminRoleValue)
  );
};

// export const NonAdminGuard: CanActivateFn = (route, state) => {
//   const store: Store = inject(Store);
//   const router: Router = inject(Router);

//   const adminRoleValue: TUserRole = 'ROLE_UBS_EMPLOYEE';

//   // Log the route and state when the guard is activated
//   console.log('NonAdminGuard activated');
//   console.log('Route:', route);
//   console.log('State:', state);

//   return store.pipe(
//     select(userRoleSelector),
//     take(1),
//     tap((userRole) => {
//       console.log('Retrieved user role:', userRole);

//       if (userRole === adminRoleValue) {
//         console.log('User has admin role. Redirecting to /ubs/admin/orders');
//         router.navigate(['/ubs/admin/orders']);
//       }
//     }),
//     map((userRole) => {
//       const canActivate = userRole !== adminRoleValue;
//       console.log('Can activate (non-admin):', canActivate);
//       return canActivate;
//     })
//   );
// };
