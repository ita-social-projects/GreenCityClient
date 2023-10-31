import { createSelector } from '@ngrx/store';
import { IAppState } from '../state/app.state';
import { Page } from 'src/app/ubs/ubs-admin/models/ubs-admin.interface';

const employeesSelector = (store: IAppState) => store.employees.employees;
export const modifiedEmployee = createSelector(employeesSelector, (modifiedEmployees) =>
  modifiedEmployees.page.map((employee: Page) => {
    return {
      ...employee,
      tariffs: employee.tariffs.map((tariff) => ({
        ...tariff,
        locations: {
          displayed: tariff.locationsDtos.slice(0, 3),
          additional: tariff.locationsDtos.slice(3)
        }
      })),
      expanded: false
    };
  })
);
