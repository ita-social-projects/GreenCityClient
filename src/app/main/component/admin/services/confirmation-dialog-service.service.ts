import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../components/confirm-modal/confirm-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { zip } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable()
export class ConfirmationDialogService {
  constructor(
    private modalService: NgbModal,
    private translation: TranslateService
  ) {}

  public confirm(
    title: string,
    message: string,
    btnOkText: 'Delete',
    btnCancelText: 'Cancel',
    dialogSize: 'sm' | 'lg' = 'sm'
  ): Promise<boolean> {
    const modalRef = this.modalService.open(ConfirmModalComponent, { size: dialogSize });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;

    zip(this.translation.get('confirm-modal.delete'), this.translation.get('confirm-modal.cancel'))
      .pipe(take(1))
      .subscribe(([translatedOkText, translatedCancelText]) => {
        modalRef.componentInstance.btnOkText = translatedOkText;
        modalRef.componentInstance.btnCancelText = translatedCancelText;
      });

    return modalRef.result;
  }
}
