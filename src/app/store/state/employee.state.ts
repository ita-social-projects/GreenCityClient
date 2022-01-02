import { Employees } from 'src/app/ubs/ubs-admin/models/ubs-admin.interface';

export interface IEmployeesState {
  employees: Employees;
}

export const initialEmployeesState: IEmployeesState = {
  employees: null
};
