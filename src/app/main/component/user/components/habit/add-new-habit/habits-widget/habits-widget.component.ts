import { Component, Input, OnInit } from '@angular/core';
import { HabitService } from '@global-service/habit/habit.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-habits-widget',
  templateUrl: './habits-widget.component.html',
  styleUrls: ['./habits-widget.component.scss']
})
export class HabitsWidgetComponent implements OnInit {
  recommendedHabits = [];
  @Input() tag: string;

  constructor(private habitService: HabitService) {}

  ngOnInit(): void {
    this.getAllHabits(1, 3);
  }

  private getAllHabits(page, size): void {
    this.habitService
      .getAllHabits(page, size)
      .pipe(take(1))
      .subscribe((data) => {
        this.recommendedHabits = data.page;
      });
  }
}
