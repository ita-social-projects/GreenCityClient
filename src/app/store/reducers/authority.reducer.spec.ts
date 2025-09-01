import { authorityReducer } from './authority.reducer';
import { initialCategoryState } from '../state/authority.state';
import { GetCategories, GetCategoriesSuccess, GetCategoriesFailure } from '../actions/authority.actions';
import { Group } from '@ubs/ubs-admin/models/employee-permissions.model';

describe('Authority Reducer', () => {
  it('should handle GetCategories action correctly', () => {
    const action = GetCategories();
    const state = authorityReducer(initialCategoryState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.categories).toBeNull();
  });

  it('should handle GetCategoriesSuccess action correctly', () => {
    const mockCategories: Group[] = [
      {
        id: '1',
        nameUk: 'Менеджер',
        nameEn: 'Manager',
        authorities: [
          {
            name: 'EDIT_EMPLOYEES_AUTHORITIES',
            descriptionEn: 'edit',
            descriptionUk: 'редагувати'
          }
        ]
      },
      {
        id: '2',
        nameUk: 'Водій',
        nameEn: 'Driver',
        authorities: [
          {
            name: 'EDIT_ORDER_DETAILS',
            descriptionEn: 'edit',
            descriptionUk: 'редагувати'
          }
        ]
      }
    ];
    const action = GetCategoriesSuccess({ categories: mockCategories });
    const state = authorityReducer(initialCategoryState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.categories).toEqual(mockCategories);
  });

  it('should handle GetCategoriesFailure action correctly', () => {
    const mockError = { status: 404, message: 'Not Found' };
    const action = GetCategoriesFailure({ error: mockError });
    const state = authorityReducer(initialCategoryState, action);

    expect(state.isLoading).toBe(false);
    expect(state.categories).toBeNull();
    expect(state.error).toEqual(mockError);
  });

  it('should return the initial state on an unknown action', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const state = authorityReducer(initialCategoryState, action as any);

    expect(state).toEqual(initialCategoryState);
  });
});
