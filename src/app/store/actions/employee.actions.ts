import { createAction, props } from '@ngrx/store';
import { FilterData } from 'src/app/ubs/ubs-admin/models/tariffs.interface';
import { Employees, Page, EmployeeDataToSend, EmployeePositionsAuthorities } from 'src/app/ubs/ubs-admin/models/ubs-admin.interface';

export enum EmployeesActions {
  GetEmployees = '[Employees] Get Employees',
  GetEmployeesSuccess = '[Employees] Get Employees Success',
  AddEmployee = '[Employees] Add Employee',
  AddEmployeeSuccess = '[Employees] Add Employee Success',
  DeleteEmployee = '[Employees] Delete Employee',
  DeleteEmployeeSuccess = '[Employees] Delete Employee Success',
  UpdateEmployee = '[Employees] Update Employee',
  UpdateEmployeeSuccess = '[Employees] Update Employee Success',
  ReceivedFailure = '[Employees] Received Failure',
  GetEmployeesPermissions = '[Employees] Get Employees Permissions',
  GetEmployeesPermissionsSuccess = '[Employees] Get Employees Permissions Success'
}

export const GetEmployees = createAction(
  EmployeesActions.GetEmployees,
  props<{ pageNumber: number; pageSize: number; search?: string; reset: boolean; sortDirection?: string; filterData: FilterData }>()
);

export const GetEmployeesSuccess = createAction(EmployeesActions.GetEmployeesSuccess, props<{ employees: Employees; reset: boolean }>());

export const AddEmployee = createAction(EmployeesActions.AddEmployee, props<{ data: FormData; employee: EmployeeDataToSend }>());

export const AddEmployeeSuccess = createAction(EmployeesActions.AddEmployeeSuccess, props<{ employee: Page }>());

export const DeleteEmployee = createAction(EmployeesActions.DeleteEmployee, props<{ id: number }>());

export const DeleteEmployeeSuccess = createAction(EmployeesActions.DeleteEmployeeSuccess, props<{ id: number }>());

export const UpdateEmployee = createAction(EmployeesActions.UpdateEmployee, props<{ data: FormData; employee: EmployeeDataToSend }>());

export const UpdateEmployeeSuccess = createAction(EmployeesActions.UpdateEmployeeSuccess, props<{ employee: Page }>());

export const ReceivedFailure = createAction(EmployeesActions.ReceivedFailure, props<{ error: string | null }>());

export const GetEmployeesPermissions = createAction(EmployeesActions.GetEmployeesPermissions, props<{ email: string; reset: boolean }>());

export const GetEmployeesPermissionsSuccess = createAction(
  EmployeesActions.GetEmployeesPermissionsSuccess,
  props<{ positionsAuthorities: EmployeePositionsAuthorities; reset: boolean }>()
);
