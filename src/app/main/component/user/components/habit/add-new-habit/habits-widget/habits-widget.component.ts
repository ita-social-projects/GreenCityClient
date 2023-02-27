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
  private page = 1;
  private size = 3;

  constructor(private habitService: HabitService) {}

  ngOnInit(): void {
    this.getAllHabits(this.page, this.size, [this.tag]);
  }

  private getAllHabits(page, size, tags): void {
    this.habitService
      .getHabitsByTagAndLang(page, size, tags)
      .pipe(take(1))
      .subscribe((data) => {
        this.recommendedHabits = data.page;
      });
  }
}
