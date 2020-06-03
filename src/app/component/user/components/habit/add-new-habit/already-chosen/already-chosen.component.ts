import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { HabitStatisticService } from 'src/app/service/habit-statistic/habit-statistic.service';
import { Observable } from 'rxjs';
import { HabitDto } from 'src/app/model/habit/HabitDto';

@Component({
  selector: 'app-already-chosen',
  templateUrl: './already-chosen.component.html',
  styleUrls: ['./already-chosen.component.scss']
})
export class AlreadyChosenComponent implements OnInit {

  private $chosen: Observable<HabitDto[]>;
  chosen: HabitDto[];

  constructor(private habitStatisticService: HabitStatisticService) { }

  ngOnInit() {
    this.$chosen = this.habitStatisticService.habitStatistics;
    this.$chosen.subscribe(data => {
      this.chosen = data;
    },
      () => {
        this.chosen = [];
      });
  }

  onDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      this.habitStatisticService.setNewHabitsState(
        this.chosen.filter(c => c.id === (event.container.data[event.currentIndex] as any).id)[0]
      );
    }
  }
}
