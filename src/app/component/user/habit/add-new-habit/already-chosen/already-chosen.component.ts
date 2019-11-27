import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

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

  constructor() { }

  ngOnInit() {
  }

  onDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }
}
