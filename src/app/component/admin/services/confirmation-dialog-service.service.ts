import {Injectable} from '@angular/core';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmModalComponent} from '../components/confirm-modal/confirm-modal.component';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class ConfirmationDialogService {

  constructor(private modalService: NgbModal, private translation: TranslateService) {
  }

  public confirm(
    title: string,
    message: string,
    btnOkText: string = 'Delete',
    btnCancelText: string = 'Cancel',
    dialogSize: 'sm' | 'lg' = 'sm'): Promise<boolean> {
    this.translation.get('confirm-modal.delete').subscribe(translated => btnOkText = translated);
    this.translation.get('confirm-modal.cancel').subscribe(translated => btnCancelText = translated);
    const modalRef = this.modalService.open(ConfirmModalComponent, {size: dialogSize});
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;

    return modalRef.result;
  }
}
