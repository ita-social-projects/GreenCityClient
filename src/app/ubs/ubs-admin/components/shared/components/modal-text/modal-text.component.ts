import { Component, Inject, Injector, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TariffsService } from '../../../../services/tariffs.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LanguageService } from 'src/app/main/i18n/language.service';

@Component({
  selector: 'app-modal-text',
  templateUrl: './modal-text.component.html',
  styleUrls: ['./modal-text.component.scss']
})
export class ModalTextComponent implements OnInit, OnDestroy {
  private destroy: Subject<boolean> = new Subject<boolean>();
  newDate: string;
  name: string;
  unsubscribe: Subject<any> = new Subject();
  title: string;
  text: string;
  text2: string;
  bagName: string;
  serviceName: string;
  action: string;
  serviceId: number;
  tariffForServiceId: number;
  isService: boolean;
  isTariffForService: boolean;
  receivedData;
  constructor(
    public dialogRef: MatDialogRef<ModalTextComponent>,
    @Inject(MAT_DIALOG_DATA) public modalData: any,
    private tariffsService: TariffsService,
    private languageService: LanguageService,
    private localeStorageService: LocalStorageService,
    private injector: Injector
  ) {
    this.receivedData = modalData;
    this.tariffsService = injector.get(TariffsService);
  }

  ngOnInit(): void {
    this.isService = this.modalData.isService;
    this.serviceId = this.modalData.serviceId;
    this.tariffForServiceId = this.modalData.bagId;
    this.isTariffForService = this.modalData.isTariffForService;
    this.title = this.modalData.title;
    this.text = this.modalData.text;
    this.text2 = this.modalData.text2 ?? '';
    this.bagName = this.modalData.bagName ?? '';
    this.serviceName = this.modalData.serviceName ?? '';
    this.action = this.modalData.action;
    this.localeStorageService.firstNameBehaviourSubject.pipe(takeUntil(this.unsubscribe)).subscribe((firstName) => {
      this.name = firstName;
    });
    this.setDate();
  }

  setDate(): void {
    const lang = this.languageService.getCurrentLanguage();
    this.newDate = this.tariffsService.setDate(lang);
  }

  deleteTariffForService() {
    this.tariffsService
      .deleteTariffForService(this.tariffForServiceId)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.dialogRef.close();
      });
  }

  deleteService() {
    this.tariffsService
      .deleteService(this.serviceId)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.dialogRef.close();
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

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
