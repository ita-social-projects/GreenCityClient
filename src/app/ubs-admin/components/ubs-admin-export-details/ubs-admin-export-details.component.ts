import { Component, Input, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { IExportDetails } from '../../models/ubs-admin.interface';

@Component({
  selector: 'app-ubs-admin-export-details',
  templateUrl: './ubs-admin-export-details.component.html',
  styleUrls: ['./ubs-admin-export-details.component.scss']
})
export class UbsAdminExportDetailsComponent implements OnDestroy {
  @Input() exportInfo: IExportDetails;
  @Input() exportDetailsForm: FormGroup;

  public receivingStations: string[];
  private destroy$: Subject<boolean> = new Subject<boolean>();
  pageOpen: boolean;

  openDetails() {
    this.pageOpen = !this.pageOpen;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
