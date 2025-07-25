// import { TestBed } from '@angular/core/testing';
// import { CanActivateFn } from '@angular/router';
//
// import { NonAdminGuard } from './non-admin.guard';
//
// xdescribe('nonAdminGuard', () => {
//   const executeGuard: CanActivateFn = (...guardParameters) => TestBed.runInInjectionContext(() => NonAdminGuard(...guardParameters));
//
//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//   });
//
//   it('should be created', () => {
//     expect(executeGuard).toBeTruthy();
//   });
// });
import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { NonAdminGuard } from './non-admin.guard';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TUserRole } from 'src/app/shared/models/auth/user-role.type';
import { userRoleSelector } from 'src/app/store/selectors/auth.selectors';
import { isObservable } from 'rxjs';

describe('NonAdminGuard', () => {
  let store: MockStore;
  let routerSpy: jasmine.SpyObj<Router>;

  const executeGuard: CanActivateFn = (...params) => TestBed.runInInjectionContext(() => NonAdminGuard(...params));

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      providers: [provideMockStore(), { provide: Router, useValue: routerSpy }]
    });

    store = TestBed.inject(MockStore);
  });

  const setupSelector = (role: TUserRole | null) => {
    store.overrideSelector(userRoleSelector, role);
  };

  function runGuardAndAssert(role: TUserRole | null, url: string, expected: boolean, expectedRedirect?: string[], done?: DoneFn) {
    setupSelector(role);
    const result = executeGuard({} as any, { url } as any);
    const assert = (res: boolean | UrlTree) => {
      if (res instanceof UrlTree) {
        expect(expected).toBeTrue(); // assume redirect counts as "true"
      } else {
        expect(res).toBe(expected);
      }

      if (expectedRedirect) {
        expect(routerSpy.navigate).toHaveBeenCalledWith(expectedRedirect);
      } else {
        expect(routerSpy.navigate).not.toHaveBeenCalled();
      }
      done?.();
    };

    if (isObservable(result)) {
      result.subscribe(assert);
    } else if (result instanceof Promise) {
      result.then(assert);
    } else {
      assert(result);
    }
  }

  it('should allow access for non-admin user', (done) => {
    runGuardAndAssert('ROLE_USER', '/some-non-exempt', true, undefined, done);
  });

  it('should deny access for admin on non-exempt route and redirect', (done) => {
    runGuardAndAssert('ROLE_UBS_EMPLOYEE', '/ubs', false, ['/ubs/admin/orders'], done);
  });

  it('should allow access for admin on exempt route', (done) => {
    runGuardAndAssert('ROLE_UBS_EMPLOYEE', '/chat-page', true, undefined, done);
  });

  it('should redirect unauthenticated user on exempt route', (done) => {
    runGuardAndAssert(null, '/chat-page', true, ['/'], done);
  });

  it('should allow unauthenticated user on non-exempt route (edge case)', (done) => {
    runGuardAndAssert(null, '/ubs', true, undefined, done);
  });
});
