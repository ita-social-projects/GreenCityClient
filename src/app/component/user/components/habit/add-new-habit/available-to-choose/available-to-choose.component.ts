import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { HabitStatisticService } from 'src/app/service/habit-statistic/habit-statistic.service';
import { Observable } from 'rxjs';
import { AvailableHabitDto } from 'src/app/model/habit/AvailableHabitDto';
import {LanguageService} from '../../../../../../i18n/language.service';

@Component({
  selector: 'app-available-to-choose',
  templateUrl: './available-to-choose.component.html',
  styleUrls: ['./available-to-choose.component.scss']
})
export class AvailableToChooseComponent implements OnInit {

  private $available: Observable<AvailableHabitDto[]>;
  available: AvailableHabitDto[];

  constructor(private habitStatisticService: HabitStatisticService, private languageService: LanguageService) { }

  ngOnInit() {
    this.habitStatisticService.loadAvailableHabits(this.languageService.getCurrentLanguage());
    this.$available = this.habitStatisticService.availableHabits;
    this.$available.subscribe(data => {
      this.available = data;
    },
      () => {
        this.available = [];
      });
  }

  onDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      this.habitStatisticService.setNewHabitsState(
        this.available.filter(c => c.id === (event.container.data[event.currentIndex] as any).id)[0]
      );
    }
  }
}
