import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';
import { AuthorityEffects } from './authority.effects';
import { AuthorityService } from '@ubs/ubs-admin/services/authority.service';
import { GetCategories, GetCategoriesSuccess, GetCategoriesFailure } from '../actions/authority.actions';
import { Group } from '@ubs/ubs-admin/models/employee-permissions.model';

describe('AuthorityEffects', () => {
  let actions$: Observable<any>;
  let effects: AuthorityEffects;
  let authorityService: jasmine.SpyObj<AuthorityService>;

  beforeEach(() => {
    authorityService = jasmine.createSpyObj('AuthorityService', ['getAllAuthorities']);

    TestBed.configureTestingModule({
      providers: [AuthorityEffects, provideMockActions(() => actions$), { provide: AuthorityService, useValue: authorityService }]
    });

    effects = TestBed.inject(AuthorityEffects);
  });

  it('should dispatch GetCategoriesSuccess on a successful API call', () => {
    const mockCategories: Group[] = [
      {
        id: '3',
        nameEn: 'Test Group',
        nameUk: 'Тестова група',
        authorities: [
          {
            name: 'TEST_AUTHORITY',
            descriptionEn: 'test',
            descriptionUk: 'тестувати'
          }
        ]
      }
    ];
    authorityService.getAllAuthorities.and.returnValue(of(mockCategories));

    actions$ = hot('-a', { a: GetCategories() });

    const expectedAction = GetCategoriesSuccess({ categories: mockCategories });
    const expected = cold('-b', { b: expectedAction });

    expect(effects.GetCategories).toBeObservable(expected);
  });

  it('should dispatch GetCategoriesFailure on a failed API call', () => {
    const mockError = { status: 404, message: 'Not Found' };
    authorityService.getAllAuthorities.and.returnValue(throwError(() => mockError));

    actions$ = hot('-a', { a: GetCategories() });

    const expectedAction = GetCategoriesFailure({ error: mockError });
    const expected = cold('-b', { b: expectedAction });

    expect(effects.GetCategories).toBeObservable(expected);
  });
});
