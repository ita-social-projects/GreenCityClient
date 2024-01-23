import { Component, Input } from '@angular/core';
import { EcoNewsModel } from '@eco-news-models/eco-news-model';
import { HabitInterface } from '../../models/interfaces/habit.interface';

@Component({
  selector: 'app-habits-widget',
  templateUrl: './habits-widget.component.html',
  styleUrls: ['./habits-widget.component.scss']
})
export class HabitsWidgetComponent {
  @Input() isHabit: boolean;
  @Input() recommendedHabits: HabitInterface[];
  @Input() recommendedNews: EcoNewsModel[];
}
