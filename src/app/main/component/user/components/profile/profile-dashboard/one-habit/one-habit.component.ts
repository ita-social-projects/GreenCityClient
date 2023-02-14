import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { HabitAssignInterface } from '../../../../../../interface/habit/habit-assign.interface';
import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { take, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HabitService } from '@global-service/habit/habit.service';
import { HabitStatus } from '@global-models/habit/HabitStatus.enum';
import { HabitMark } from '@global-user/models/HabitMark.enum';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-one-habit',
  templateUrl: './one-habit.component.html',
  styleUrls: ['./one-habit.component.scss']
})
export class OneHabitComponent implements OnInit, OnDestroy {
  @Input() habit: HabitAssignInterface;
  currentDate: string;
  showPhoto: boolean;
  daysCounter: number;
  habitMark: string;
  isRequest = false;
  firstFriend = 'assets/img/kimi.png';
  secondFriend = 'assets/img/lewis.png';
  private destroy$ = new Subject<void>();
  private descriptionType = {
    acquired: () => {
      this.daysCounter = this.habit.duration;
      this.showPhoto = false;
      this.habitMark = HabitMark.AQUIRED;
    },
    done: () => {
      this.daysCounter = this.habit.workingDays;
      this.showPhoto = false;
      this.habitMark = HabitMark.DONE;
    },
    undone: () => {
      this.daysCounter = this.habit.workingDays;
      this.showPhoto = true;
      this.habitMark = HabitMark.UNDONE;
    }
  };

  @Output() nowAcquiredHabit = new EventEmitter();

  constructor(
    private habitAssignService: HabitAssignService,
    public datePipe: DatePipe,
    public router: Router,
    public habitService: HabitService
  ) {}

  ngOnInit() {
    this.currentDate = this.datePipe.transform(new Date(), 'yyy-MM-dd');
    this.buildHabitDescription();
  }

  public goToHabitProfile() {
    const userId = localStorage.getItem('userId');
    this.router.navigate([`profile/${userId}/allhabits/addhabit/${this.habit.habit.id}`]);
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

  setGreenCircleInCalendar(isSetCircle: boolean) {
    const lastDay = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
    const lastDayInMonth = this.datePipe.transform(lastDay, 'yyy-MM-dd');
    const dataFromDashBoard = this.habitAssignService.habitsFromDashBoard.find((item) => item.enrollDate === this.currentDate);
    if (dataFromDashBoard) {
      dataFromDashBoard.habitAssigns.find((item) => item.habitId === this.habit.habit.id).enrolled = isSetCircle;
    } else {
      this.habitAssignService
        .getAssignHabitsByPeriod(this.currentDate, lastDayInMonth)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          this.habitAssignService.habitsFromDashBoard = res;
          this.habitAssignService.habitsFromDashBoard
            .find((item) => item.enrollDate === this.currentDate)
            .habitAssigns.find((item) => item.habitId === this.habit.habit.id).enrolled = isSetCircle;
        });
    }
  }

  public enroll() {
    this.isRequest = true;
    this.habitAssignService
      .enrollByHabit(this.habit.habit.id, this.currentDate)
      .pipe(take(1))
      .subscribe((response) => {
        this.setGreenCircleInCalendar(true);
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
        this.setGreenCircleInCalendar(false);
        this.habit.habitStatusCalendarDtoList = response.habitStatusCalendarDtoList;
        this.habit.workingDays = response.workingDays;
        this.habit.habitStreak = response.habitStreak;
        this.buildHabitDescription();
        this.isRequest = false;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
