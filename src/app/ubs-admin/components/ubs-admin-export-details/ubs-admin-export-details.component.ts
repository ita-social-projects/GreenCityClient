import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IExportDetails } from '../../models/ubs-admin.interface';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-ubs-admin-export-details',
  templateUrl: './ubs-admin-export-details.component.html',
  styleUrls: ['./ubs-admin-export-details.component.scss']
})
export class UbsAdminExportDetailsComponent implements OnInit, OnDestroy {
  @Input() order;
  @Input() exportDetailsForm: FormGroup;

  public receivingStations: string[];
  private destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private fb: FormBuilder, private orderService: OrderService) {}

  ngOnInit(): void {
    this.getReceivingStations();
  }

  public getReceivingStations(): void {
    this.orderService
      .getAllReceivingStations()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.receivingStations = data.map((el) => el.name);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
