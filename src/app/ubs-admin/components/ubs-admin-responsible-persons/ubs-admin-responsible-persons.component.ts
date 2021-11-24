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
  @Input() orderId: number;
  @Input() responsiblePersonsForm: FormGroup;

  public allCallManagers: string[];
  public allLogisticians: string[];
  public allNavigators: string[];
  public allDrivers: string[];
  pageOpen: boolean;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  ngOnInit(): void {
    this.getOrderEmployees(this.orderId);
  }

  openDetails() {
    this.pageOpen = !this.pageOpen;
  }

  getOrderEmployees(orderId: number) {
    const employees = this.responsiblePersonInfo.allPositionsEmployees;
    this.allCallManagers = this.processEmployeeById(employees, 2);
    this.allLogisticians = this.processEmployeeById(employees, 3);
    this.allNavigators = this.processEmployeeById(employees, 4);
    this.allDrivers = this.processEmployeeById(employees, 5);
  }

  processEmployeeById(employees: Map<string, string[]>, id: number): string[] {
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
