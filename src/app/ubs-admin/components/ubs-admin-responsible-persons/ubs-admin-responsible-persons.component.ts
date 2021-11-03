import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-ubs-admin-responsible-persons',
  templateUrl: './ubs-admin-responsible-persons.component.html',
  styleUrls: ['./ubs-admin-responsible-persons.component.scss']
})
export class UbsAdminResponsiblePersonsComponent implements OnInit, OnDestroy {
  @Input() order;
  @Input() responsiblePersonsForm: FormGroup;

  public allCallManagers: string[];
  public allLogisticians: string[];
  public allNavigators: string[];
  public allDrivers: string[];
  pageOpen: boolean;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.getOrderEmployees(this.order.id);
  }

  openDetails() {
    this.pageOpen = !this.pageOpen;
  }

  getOrderEmployees(orderId: number) {
    this.orderService
      .getAllResponsiblePersons(orderId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        const employees = data.allPositionsEmployees;
        this.allCallManagers = this.processEmployeeById(employees, 2);
        this.allLogisticians = this.processEmployeeById(employees, 3);
        this.allNavigators = this.processEmployeeById(employees, 4);
        this.allDrivers = this.processEmployeeById(employees, 5);
      });
  }

  processEmployeeById(employees: any[], id: number): string[] {
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
