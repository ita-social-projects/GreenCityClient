import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HabitStatisticService } from '../habit-statistic/habit-statistic.service';

@Injectable({
  providedIn: 'root'
})
export class UiActionsService {

  private uiStateSubject = new BehaviorSubject<IUiState>({} as IUiState);
  private uiStateStore: IUiState = {
    addNewHabitModalVisible: true
  };

  readonly uiState = this.uiStateSubject.asObservable();

  constructor(private habitStatisticService: HabitStatisticService) { }

  showAddHabitModal() {
    this.uiStateStore.addNewHabitModalVisible = true;
    this.uiStateSubject.next(Object.assign({} as IUiState, this.uiStateStore));
  }

  hideAddHabitModal() {
    this.uiStateStore.addNewHabitModalVisible = false;
    this.uiStateSubject.next(Object.assign({} as IUiState, this.uiStateStore));
    this.habitStatisticService.clearDataStore();
  }
}
