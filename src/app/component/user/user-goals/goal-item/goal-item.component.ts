import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Goal} from '../../../../model/goal/Goal';

@Component({
  selector: 'app-goal-item',
  templateUrl: './goal-item.component.html',
  styleUrls: ['./goal-item.component.css']
})
export class GoalItemComponent implements OnInit {
  @Input() goal: Goal;
  @Output() update = new EventEmitter();

  constructor() {
  }

  onUpdate() {
    this.update.emit(this.goal);
  }

  ngOnInit() {
  }

}
