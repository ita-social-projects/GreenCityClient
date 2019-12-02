import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiActionsService {

  private uiStateSubject = new BehaviorSubject<IUiState>({} as IUiState);
  private uiStateStore: IUiState = {
    addNewHabitModalVisible: true
  };

  readonly uiState = this.uiStateSubject.asObservable();

  constructor() { }

  showAddHabitModal() {
    this.uiStateStore.addNewHabitModalVisible = true;
    this.uiStateSubject.next(Object.assign({} as IUiState, this.uiStateStore));
  }

  hideAddHabitModal() {
    this.uiStateStore.addNewHabitModalVisible = false;
    this.uiStateSubject.next(Object.assign({} as IUiState, this.uiStateStore));
  }
}
