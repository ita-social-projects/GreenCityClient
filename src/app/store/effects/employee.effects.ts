import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
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
  ActivateEmployee,
  ActivateEmployeeSuccess,
  ReceivedFailure,
  GetEmployeesPermissions,
  GetEmployeesPermissionsSuccess
} from '../actions/employee.actions';
import { UbsAdminEmployeeService } from 'src/app/ubs/ubs-admin/services/ubs-admin-employee.service';
import {
  Employees,
  EmployeeDataResponse,
  EmployeeDataToSend,
  EmployeePositionsAuthorities
} from 'src/app/ubs/ubs-admin/models/ubs-admin.interface';
import { EMPTY, of } from 'rxjs';
import { FilterData } from 'src/app/ubs/ubs-admin/models/tariffs.interface';

@Injectable()
export class EmployeesEffects {
  constructor(private actions: Actions, private ubsAdminEmployeeService: UbsAdminEmployeeService) {}

  getEmployees = createEffect(() => {
    return this.actions.pipe(
      ofType(GetEmployees),
      mergeMap(
        (actions: {
          pageNumber: number;
          pageSize: number;
          search?: string;
          sortBy?: string;
          reset: boolean;
          sortDirection?: string;
          filterData: FilterData;
        }) => {
          return this.ubsAdminEmployeeService
            .getEmployees(actions.pageNumber, actions.pageSize, actions.search, actions.sortBy, actions.sortDirection, actions.filterData)
            .pipe(
              map((employees: Employees) => GetEmployeesSuccess({ employees, reset: actions.reset })),
              catchError(() => EMPTY)
            );
        }
      )
    );
  });

  addEmployee = createEffect(() => {
    return this.actions.pipe(
      ofType(AddEmployee),
      mergeMap((action: { data: FormData; employee: EmployeeDataToSend }) => {
        return this.ubsAdminEmployeeService.postEmployee(action.data).pipe(
          map((data: EmployeeDataResponse) => {
            const employee = JSON.parse(JSON.stringify(action.employee.employeeDto));
            employee.id = data.employeeDto.id;
            employee.tariffs = data.tariffs;
            if (employee.image !== data.employeeDto.image) {
              employee.image = data.employeeDto.image;
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
      mergeMap((action: { data: FormData; employee: EmployeeDataToSend }) => {
        return this.ubsAdminEmployeeService.updateEmployee(action.data).pipe(
          map((data: EmployeeDataResponse) => {
            const employee = JSON.parse(JSON.stringify(action.employee.employeeDto));
            employee.tariffs = data.tariffs;
            if (employee.image !== data.employeeDto.image) {
              employee.image = data.employeeDto.image;
            }
            return UpdateEmployeeSuccess({ employee });
          }),
          catchError((error) => of(ReceivedFailure(error)))
        );
      })
    );
  });

  activateEmployee = createEffect(() => {
    return this.actions.pipe(
      ofType(ActivateEmployee),
      mergeMap((action: { id: number }) => {
        return this.ubsAdminEmployeeService.activateEmployee(action.id).pipe(
          map(() => ActivateEmployeeSuccess({ id: action.id })),
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

  getEmployeesPermissions = createEffect(() => {
    return this.actions.pipe(
      ofType(GetEmployeesPermissions),
      mergeMap((actions: { email: string }) => {
        return this.ubsAdminEmployeeService.getEmployeePositionsAuthorities(actions.email).pipe(
          map((positionsAuthorities: EmployeePositionsAuthorities) => GetEmployeesPermissionsSuccess({ positionsAuthorities })),
          catchError(() => EMPTY)
        );
      })
    );
  });
}
