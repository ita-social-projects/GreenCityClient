import { Component, OnInit, OnDestroy } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { HabitStatisticService } from 'src/app/service/habit-statistic/habit-statistic.service';

@Component({
  selector: 'app-already-chosen',
  templateUrl: './already-chosen.component.html',
  styleUrls: ['./already-chosen.component.css']
})
export class AlreadyChosenComponent implements OnInit, OnDestroy {

  private $chosen;
  chosen: any;

  constructor(private habitStatisticService: HabitStatisticService) { }

  ngOnInit() {
    this.$chosen = this.habitStatisticService.habitStatistics;
    this.$chosen.subscribe(data => {
      this.chosen = data;
    });
  }

  ngOnDestroy() {
    this.$chosen.unsubscribe();
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
