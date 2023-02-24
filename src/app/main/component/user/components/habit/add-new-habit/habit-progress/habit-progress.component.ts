import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { HabitStatus } from '@global-models/habit/HabitStatus.enum';
import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { HabitMark } from '@global-user/models/HabitMark.enum';
import { take } from 'rxjs/operators';
import { HabitAssignInterface } from 'src/app/main/interface/habit/habit-assign.interface';

@Component({
  selector: 'app-habit-progress',
  templateUrl: './habit-progress.component.html',
  styleUrls: ['./habit-progress.component.scss']
})
export class HabitProgressComponent implements OnChanges {
  @Input() habit: HabitAssignInterface;
  public indicator: number;
  isRequest = false;
  currentDate: string;
  showPhoto: boolean;
  daysCounter: number;
  habitMark: string;
  heightThumbLabel = 4;
  public isHidden = false;
  private descriptionType = {
    acquired: () => {
      this.habitMark = HabitMark.AQUIRED;
    },
    done: () => {
      this.habitMark = HabitMark.DONE;
    },
    undone: () => {
      this.habitMark = HabitMark.UNDONE;
    }
  };

  @Output() nowAcquiredHabit = new EventEmitter();

  constructor(private habitAssignService: HabitAssignService) {}

  ngOnChanges() {
    this.countProgressBar();
  }

  public countProgressBar(): void {
    this.indicator = Math.round((this.habit.workingDays / this.habit.duration) * 100);
  }

  public buildHabitDescription(): void {
    const isDone = this.habit.habitStatusCalendarDtoList.some((item) => item.enrollDate === this.currentDate);
    if (this.habit.status === HabitStatus.ACQUIRED) {
      this.descriptionType.acquired();
    } else if (this.habit.status === HabitStatus.INPROGRESS) {
      if (isDone) {
        this.descriptionType.done();
      } else {
        this.descriptionType.undone();
      }
    }
  }

  public enroll() {
    this.isRequest = true;
    this.habitAssignService
      .enrollByHabit(this.habit.habit.id, this.currentDate)
      .pipe(take(1))
      .subscribe((response: any) => {
        if (response.status === HabitStatus.ACQUIRED) {
          this.descriptionType.acquired();
          this.nowAcquiredHabit.emit(response);
        } else {
          this.habit.habitStatusCalendarDtoList = response.habitStatusCalendarDtoList;
          this.habit.workingDays = response.workingDays;
          this.habit.habitStreak = response.habitStreak;
          this.buildHabitDescription();
          this.isRequest = false;
        }
      });
  }

  public unenroll() {
    this.isRequest = true;
    this.habitAssignService
      .unenrollByHabit(this.habit.habit.id, this.currentDate)
      .pipe(take(1))
      .subscribe((response) => {
        this.habit.habitStatusCalendarDtoList = response.habitStatusCalendarDtoList;
        this.habit.workingDays = response.workingDays;
        this.habit.habitStreak = response.habitStreak;
        this.buildHabitDescription();
        this.isRequest = false;
      });
  }

  public getDayName(): string {
    return this.habit.habitStreak === 1 ? 'user.habit.one-habit.good-day' : 'user.habit.one-habit.good-days';
  }
}
