import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { TariffsService } from 'src/app/ubs/ubs-admin/services/tariffs.service';

@Component({
  selector: 'app-dialog-tariff',
  templateUrl: './dialog-tariff.component.html',
  styleUrls: ['./dialog-tariff.component.scss']
})
export class DialogTariffComponent implements OnInit {
  @Input() row: TemplateRef<any>;
  @Input() newDate;
  @Input() name: string;

  constructor() {}

  ngOnInit(): void {}
}
