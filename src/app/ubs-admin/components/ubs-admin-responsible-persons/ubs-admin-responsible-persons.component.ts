import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { IResponsiblePersons } from '../../models/ubs-admin.interface';

@Component({
  selector: 'app-ubs-admin-responsible-persons',
  templateUrl: './ubs-admin-responsible-persons.component.html',
  styleUrls: ['./ubs-admin-responsible-persons.component.scss']
})
export class UbsAdminResponsiblePersonsComponent implements OnInit, OnDestroy {
  @Input() responsiblePersonInfo: IResponsiblePersons;
  @Input() responsiblePersonsForm: FormGroup;

  public allCallManagers: string[];
  public allLogisticians: string[];
  public allNavigators: string[];
  public allDrivers: string[];
  pageOpen: boolean;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  ngOnInit(): void {
    this.setEmployeesByPosition();
  }

  openDetails() {
    this.pageOpen = !this.pageOpen;
  }

  setEmployeesByPosition() {
    const employees = this.responsiblePersonInfo.allPositionsEmployees;
    this.allCallManagers = this.getEmployeesById(employees, 2);
    this.allLogisticians = this.getEmployeesById(employees, 3);
    this.allNavigators = this.getEmployeesById(employees, 4);
    this.allDrivers = this.getEmployeesById(employees, 5);
  }

  getEmployeesById(employees: Map<string, string[]>, id: number): string[] {
    for (const key of Object.keys(employees)) {
      if (key.includes(`id=${id},`)) {
        return employees[key];
      }
    }
    return [];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
