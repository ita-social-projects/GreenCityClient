import { fakeAsync, flush, TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TUserRole } from '@global-models/auth/user-role.type';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { UbsAdminGuard } from '@ubs/ubs-admin/ubs-admin-guard.guard';

describe('UbsAdminGuard', () => {
  let store: MockStore<{
    auth: {
      user: {
        role: TUserRole;
      };
    };
  }>;

  const route: ActivatedRouteSnapshot = {} as any;
  const state: RouterStateSnapshot = {} as any;
  const initialState = {
    auth: {
      user: {
        role: 'ROLE_UBS_EMPLOYEE'
      }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [provideMockStore({ initialState })]
    });

    store = TestBed.inject<any>(Store);
  });

  it('should allow access for UBS admin', fakeAsync(() => {
    store.setState({ auth: { user: { role: 'ROLE_UBS_EMPLOYEE' } } });
    const result = TestBed.runInInjectionContext(() => UbsAdminGuard(route, state));

    flush();
    expect(result).toBeTruthy();
  }));

  it('should not allow access for not admin', fakeAsync(() => {
    store.setState({ auth: { user: { role: 'ROLE_USER' } } });
    const result = TestBed.runInInjectionContext(() => UbsAdminGuard(route, state));

    flush();
    expect(result).toBeTruthy();
  }));
});
