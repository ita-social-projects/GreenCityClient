import { selectAuthorityState, selectCategories } from './authority.selectors';
import { IUbsAuthorityState } from '../state/authority.state';
import { Permission } from '@ubs/ubs-admin/models/employee-permissions.model';

describe('Authority Selectors', () => {
  const mockInitialState = {
    authority: {
      categories: [
        {
          id: '1',
          nameEn: 'Test Category 1',
          nameUk: 'Тестова Категорія 1',
          authorities: [{ name: 'AUTH_1', descriptionEn: 'desc', descriptionUk: 'опис' } as Permission]
        },
        {
          id: '2',
          nameEn: 'Test Category 2',
          nameUk: 'Тестова Категорія 2',
          authorities: [{ name: 'AUTH_2', descriptionEn: 'desc', descriptionUk: 'опис' } as Permission]
        }
      ],
      isLoading: false,
      error: null
    }
  } as any;

  it('should select the authority state correctly', () => {
    const expectedState: IUbsAuthorityState = mockInitialState.authority;
    const selectedState = selectAuthorityState(mockInitialState);

    expect(selectedState).toEqual(expectedState);
  });

  it('should select the categories from the authority state', () => {
    const expectedCategories = mockInitialState.authority.categories;
    const selectedCategories = selectCategories.projector(mockInitialState.authority);

    expect(selectedCategories).toEqual(expectedCategories);
  });

  it('should return null if categories are not yet loaded', () => {
    const stateWithNullCategories: IUbsAuthorityState = {
      categories: null,
      isLoading: true,
      error: null
    };
    const selectedCategories = selectCategories.projector(stateWithNullCategories);

    expect(selectedCategories).toBeNull();
  });
});
