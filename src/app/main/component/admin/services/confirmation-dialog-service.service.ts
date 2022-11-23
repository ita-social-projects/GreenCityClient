import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../components/confirm-modal/confirm-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';

@Injectable()
export class ConfirmationDialogService {
  constructor(private modalService: NgbModal, private translation: TranslateService) {}

  public confirm(
    title: string,
    message: string,
    btnOkText: string = 'Delete',
    btnCancelText: string = 'Cancel',
    dialogSize: 'sm' | 'md' | 'lg' = 'sm'
  ): Promise<boolean> {
    const modalRef = this.modalService.open(ConfirmModalComponent, { size: dialogSize });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;

    if (!btnOkText) {
      this.translation
        .get('confirm-modal.delete')
        .pipe(take(1))
        .subscribe((translatedOkText) => {
          modalRef.componentInstance.btnOkText = translatedOkText;
        });
    }

    if (!btnCancelText) {
      this.translation
        .get('confirm-modal.cancel')
        .pipe(take(1))
        .subscribe((translatedCancelText) => {
          modalRef.componentInstance.btnCancelText = translatedCancelText;
        });
    }

    return modalRef.result;
  }
}
