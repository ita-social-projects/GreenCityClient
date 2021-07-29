import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, FormBuilder } from '@angular/forms';
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
  public orderId = 893;
  public orderExportDetailsForm: FormGroup;
  public receivingStations: string[];
  public orderExportDetails: IExportDetails;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private fb: FormBuilder, private orderService: OrderService) {}

  ngOnInit(): void {
    this.initForm();
    this.getExportDetails();
  }

  public initForm() {
    this.orderExportDetailsForm = this.fb.group({
      exportedDate: [''],
      exportedTime: [''],
      receivingStation: [''],
      allReceivingStations: this.fb.array([])
    });
  }

  public patchFormData(): void {
    this.orderExportDetailsForm.patchValue(this.orderExportDetails);
  }

  public getExportDetails(): void {
    this.orderService
      .getOrderExportDetails(this.orderId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: IExportDetails) => {
        this.orderExportDetails = data;
        this.orderExportDetails.exportedDate = new Date(data.exportedDate).toISOString().substr(0, 10);
        this.receivingStations = data.allReceivingStations;
        this.patchFormData();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
