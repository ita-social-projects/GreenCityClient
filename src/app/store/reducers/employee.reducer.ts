import { initialEmployeesState } from '../state/employee.state';
import { GetEmployeesSuccess, AddEmployeeSuccess, DeleteEmployeeSuccess, UpdateEmployeeSuccess } from '../actions/employee.actions';
import { createReducer, on } from '@ngrx/store';

export const employeesReducer = createReducer(
  initialEmployeesState,
  on(GetEmployeesSuccess, (state, action) => {
    const prevEmployees = state.employees?.content ?? [];
    return {
      ...state,
      employees: {
        ...action.employees,
        content: [...prevEmployees, ...action.employees.content]
      }
    };
  }),

  on(AddEmployeeSuccess, (state, action) => ({
    ...state,
    employees: {
      ...state.employees,
      content: [...state.employees.content, action.employee]
    }
  })),

  on(DeleteEmployeeSuccess, (state, action) => ({
    ...state,
    employees: {
      ...state.employees,
      content: state.employees.content.filter((employee) => employee.id !== action.id)
    }
  })),

  on(UpdateEmployeeSuccess, (state, action) => ({
    ...state,
    employees: {
      ...state.employees,
      content: state.employees.content.map((employee) => (employee.id === action.employee.id ? action.employee : employee))
    }
  }))
);
