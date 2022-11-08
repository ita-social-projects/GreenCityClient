import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-modal-text',
  templateUrl: './modal-text.component.html',
  styleUrls: ['./modal-text.component.scss']
})
export class ModalTextComponent implements OnInit {
  datePipe = new DatePipe('ua');
  newDate = this.datePipe.transform(new Date(), 'MMM dd, yyyy');
  name: string;
  unsubscribe: Subject<any> = new Subject();
  title: string;
  text: string;
  text2: string;
  bagName: string;
  serviceName: string;
  action: string;
  constructor(
    public dialogRef: MatDialogRef<ModalTextComponent>,
    @Inject(MAT_DIALOG_DATA) public modalData: any,
    private localeStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.title = this.modalData.title;
    this.text = this.modalData.text;
    this.text2 = this.modalData.text2 ?? '';
    this.bagName = this.modalData.bagName ?? '';
    this.serviceName = this.modalData.serviceName ?? '';
    this.action = this.modalData.action;
    this.localeStorageService.firstNameBehaviourSubject.pipe(takeUntil(this.unsubscribe)).subscribe((firstName) => {
      this.name = firstName;
    });
  }

  onYesClick(reply: boolean): void {
    this.dialogRef.close(reply);
  }

  onNoClick() {
    this.dialogRef.close();
  }

  check(val: string): boolean {
    return val === 'cancel';
  }
}
