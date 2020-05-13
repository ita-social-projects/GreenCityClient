import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private modals: any[] = [];

  add(modal: any) {
    // add _modal to array of active modals
    this.modals.push(modal);
  }

  remove(id: string) {
    // remove _modal from array of active modals
    this.modals = this.modals.filter(x => x.id !== id);
  }

  open(id: string) {
    // open _modal specified by id
    const modal = this.modals.find(x => x.id === id);
    modal.open();
  }

  close(id: string) {
    // close _modal specified by id
    const modal = this.modals.find(x => x.id === id);
    modal.close();
  }
}
