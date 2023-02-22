import { Injectable } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import {
  GetEmployees,
  GetEmployeesSuccess,
  AddEmployee,
  AddEmployeeSuccess,
  DeleteEmployee,
  DeleteEmployeeSuccess,
  UpdateEmployee,
  UpdateEmployeeSuccess,
  ReceivedFailure
} from '../actions/employee.actions';
import { UbsAdminEmployeeService } from 'src/app/ubs/ubs-admin/services/ubs-admin-employee.service';
import { Employees, Page } from 'src/app/ubs/ubs-admin/models/ubs-admin.interface';
import { EMPTY, of } from 'rxjs';

@Injectable()
export class EmployeesEffects {
  constructor(private actions: Actions, private ubsAdminEmployeeService: UbsAdminEmployeeService) {}

  getEmployees = createEffect(() => {
    return this.actions.pipe(
      ofType(GetEmployees),
      mergeMap((actions: { pageNumber: number; pageSize: number; search?: string; reset: boolean }) => {
        return this.ubsAdminEmployeeService.getEmployees(actions.pageNumber, actions.pageSize, actions.search).pipe(
          map((employees: Employees) => GetEmployeesSuccess({ employees, reset: actions.reset })),
          catchError(() => EMPTY)
        );
      })
    );
  });

  addEmployee = createEffect(() => {
    return this.actions.pipe(
      ofType(AddEmployee),
      mergeMap((action: { data: FormData; employee: any }) => {
        return this.ubsAdminEmployeeService.postEmployee(action.data).pipe(
          map((data: any) => {
            const employee = JSON.parse(JSON.stringify(action.employee.employeeDto));
            employee.id = data.employeeDto.id;
            employee.tariffs = data.tariffs;
            if (employee.image !== data.image) {
              employee.image = data.image;
            }
            return AddEmployeeSuccess({ employee });
          }),
          catchError((error) => of(ReceivedFailure(error)))
        );
      })
    );
  });

  updateEmployee = createEffect(() => {
    return this.actions.pipe(
      ofType(UpdateEmployee),
      mergeMap((action: { data: FormData; employee: Page }) => {
        return this.ubsAdminEmployeeService.updateEmployee(action.data).pipe(
          map((data: Page) => {
            const employee = JSON.parse(JSON.stringify(action.employee));
            if (employee.image !== data.image) {
              employee.image = data.image;
            }
            return UpdateEmployeeSuccess({ employee });
          }),
          catchError((error) => of(ReceivedFailure(error)))
        );
      })
    );
  });

  deleteEmployee = createEffect(() => {
    return this.actions.pipe(
      ofType(DeleteEmployee),
      mergeMap((action: { id: number }) => {
        return this.ubsAdminEmployeeService.deleteEmployee(action.id).pipe(
          map(() => DeleteEmployeeSuccess({ id: action.id })),
          catchError((error) => of(ReceivedFailure(error)))
        );
      })
    );
  });
}
