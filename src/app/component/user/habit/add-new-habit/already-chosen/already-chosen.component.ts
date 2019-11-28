import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { HabitStatisticService } from 'src/app/service/habit-statistic/habit-statistic.service';
import { NewHabitDto } from 'src/app/model/habit/NewHabitDto';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-already-chosen',
  templateUrl: './already-chosen.component.html',
  styleUrls: ['./already-chosen.component.css']
})
export class AlreadyChosenComponent implements OnInit {

  chosen = [
    { id: 1, caption: 'Habit1', description: 'Lorem Lorem ipsum dolor sit amet, consectetur adipiscing elit dolor' },
    { id: 2, caption: 'Habit2', description: 'Lorem Lorem ipsum dolor sit amet, consectetur adipiscing elit dolor' },
    { id: 3, caption: 'Habit3', description: 'Lorem Lorem ipsum dolor sit amet, consectetur adipiscing elit dolor' },
    { id: 4, caption: 'Habit4', description: 'Lorem Lorem ipsum dolor sit amet, consectetur adipiscing elit dolor' },
  ];

  // justChosenStore = [];
  // private $justChosenSubject = new BehaviorSubject<[]>([]);
  // readonly justChosen = this.$justChosenSubject.asObservable();

  constructor(private habitStatisticService: HabitStatisticService) { }

  ngOnInit() {
    this.habitStatisticService.habitStatistics.subscribe(data => {
      //this.chosen = data;
    });
  }

  onDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // console.log("Prev. container data");
      // console.log(event.previousContainer.data);
      // console.log("Container data");
      // console.log(event.container.data);
      // console.log("Prev. index");
      // console.log(event.previousIndex);
      // console.log("Curr. index");
      // console.log(event.currentIndex);
      // console.log("Index test");
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      this.habitStatisticService.setNewHabitsState(
        this.chosen.filter(c => c.id === (event.container.data[event.currentIndex] as any).id)[0]
      );
    }
  }
}
