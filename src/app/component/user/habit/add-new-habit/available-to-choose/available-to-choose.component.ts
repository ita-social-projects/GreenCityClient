import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { HabitStatisticService } from 'src/app/service/habit-statistic/habit-statistic.service';

@Component({
  selector: 'app-available-to-choose',
  templateUrl: './available-to-choose.component.html',
  styleUrls: ['./available-to-choose.component.css']
})
export class AvailableToChooseComponent implements OnInit {

  available = [
    { id: 5, caption: 'Habit5', description: 'Lorem Lorem ipsum dolor sit amet, consectetur adipiscing elit dolor' },
    { id: 6, caption: 'Habit6', description: 'Lorem Lorem ipsum dolor sit amet, consectetur adipiscing elit dolor' },
    { id: 7, caption: 'Habit7', description: 'Lorem Lorem ipsum dolor sit amet, consectetur adipiscing elit dolor' },
    { id: 8, caption: 'Habit8', description: 'Lorem Lorem ipsum dolor sit amet, consectetur adipiscing elit dolor' },
  ];

  constructor(private habitStatisticService: HabitStatisticService) { }

  ngOnInit() {
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
