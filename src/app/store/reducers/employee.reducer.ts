import { initialEmployeesState } from '../state/employee.state';
import {
  GetEmployeesSuccess,
  AddEmployeeSuccess,
  DeleteEmployeeSuccess,
  UpdateEmployeeSuccess,
  ActivateEmployeeSuccess,
  ReceivedFailure,
  GetEmployeesPermissionsSuccess,
  ResetEmployeePermissions
} from '../actions/employee.actions';
import { createReducer, on } from '@ngrx/store';

export const employeesReducer = createReducer(
  initialEmployeesState,
  on(GetEmployeesSuccess, (state, action) => {
    const prevEmployees = action.reset ? [] : state.employees?.page ?? [];
    return {
      ...state,
      employees: {
        ...action.employees,
        content: [...prevEmployees, ...action.employees.page]
      }
    };
  }),

  on(AddEmployeeSuccess, (state, action) => ({
    ...state,
    employees: {
      ...state.employees,
      content: [action.employee, ...state.employees.page]
    }
  })),

  on(ActivateEmployeeSuccess, (state, action) => ({
    ...state,
    employees: {
      ...state.employees,
      content: state.employees.page.map((employee) => (employee.id === action.id ? { ...employee, employeeStatus: 'ACTIVE' } : employee))
    }
  })),

  on(DeleteEmployeeSuccess, (state, action) => ({
    ...state,
    employees: {
      ...state.employees,
      content: state.employees.page.map((employee) => (employee.id === action.id ? { ...employee, employeeStatus: 'INACTIVE' } : employee))
    }
  })),

  on(UpdateEmployeeSuccess, (state, action) => ({
    ...state,
    employees: {
      ...state.employees,
      page: state.employees.page.map((employee) => (employee.id === action.employee.id ? action.employee : employee))
    }
  })),

  on(ReceivedFailure, (state, action) => ({
    ...state,
    error: action.error
  })),

  on(GetEmployeesPermissionsSuccess, (state, action) => {
    return {
      ...state,
      employeesPermissions: action.positionsAuthorities.authorities
    };
  }),

  on(ResetEmployeePermissions, (state) => {
    return {
      ...state,
      employeesPermissions: []
    };
  })
);
