import { Component, OnInit, OnDestroy } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { HabitStatisticService } from 'src/app/service/habit-statistic/habit-statistic.service';

@Component({
  selector: 'app-available-to-choose',
  templateUrl: './available-to-choose.component.html',
  styleUrls: ['./available-to-choose.component.css']
})
export class AvailableToChooseComponent implements OnInit, OnDestroy {

  private $available;
  available: any;

  constructor(private habitStatisticService: HabitStatisticService) { }

  ngOnInit() {
    this.habitStatisticService.loadAvailableHabits();
    this.$available = this.habitStatisticService.availableHabits;
    this.$available.subscribe(data => {
      this.available = data;
    });
  }

  ngOnDestroy() {
    this.$available.unsubscribe();
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
