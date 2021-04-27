import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { HabitAssignInterface } from '../../../../../../interface/habit/habit-assign.interface';
import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { take } from 'rxjs/operators';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HabitService } from '@global-service/habit/habit.service';
import { HabitStatus } from '@global-models/habit/HabitStatus.enum';

@Component({
  selector: 'app-one-habit',
  templateUrl: './one-habit.component.html',
  styleUrls: ['./one-habit.component.scss']
})
export class OneHabitComponent implements OnInit {
  @Input() habit: HabitAssignInterface;
  currentDate: string;
  showPhoto: boolean;
  daysCounter: number;
  habitMark: string;
  isRequest = false;
  // backgroundImage = 'assets/img/man.svg';
  firstFriend = 'assets/img/kimi.png';
  secondFriend = 'assets/img/lewis.png';
  private descriptionType = {
    acquired: () => {
      this.daysCounter = this.habit.duration;
      this.showPhoto = false;
      this.habitMark = 'aquired';
    },
    done: () => {
      this.daysCounter = this.habit.workingDays
        ? this.habit.workingDays
        : this.habit.duration;
      this.showPhoto = false;
      this.habitMark = 'done';
    },
    undone: () => {
      this.daysCounter = this.habit.workingDays
        ? this.habit.workingDays
        : this.habit.duration;
      this.showPhoto = true;
      this.habitMark = 'undone';
    }
  };

  @Output () nowAcquiredHabit = new EventEmitter();

  constructor(private localStorageService: LocalStorageService,
              private habitAssignService: HabitAssignService,
              public router: Router,
              public route: ActivatedRoute,
              public habitService: HabitService) {}

  ngOnInit() {
    this.currentDate = this.formatDate(new Date());
    this.buildHabitDescription();
  }

  public goHabitMore() {
    const userId = localStorage.getItem('userId');
    this.router.navigate([`profile/${userId}/allhabits/addhabit/${this.habit.habit.id}`]);
  }

  public buildHabitDescription(): void {
    const isDone = this.habit.habitStatusCalendarDtoList
      .some(item => item.enrollDate === this.currentDate);
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

  private formatDate(date: Date): string {
    return date.toLocaleDateString()
      .split('.')
      .reverse()
      .join('-');
  }

  public enroll() {
    this.isRequest = true;
    this.habitAssignService.enrollByHabit(this.habit.habit.id, this.currentDate)
    .pipe(take(1))
    .subscribe(response => {
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
    this.habitAssignService.unenrollByHabit(this.habit.habit.id, this.currentDate)
      .pipe(take(1))
      .subscribe(response => {
        this.habit.habitStatusCalendarDtoList = response.habitStatusCalendarDtoList;
        this.habit.workingDays = response.workingDays;
        this.habit.habitStreak = response.habitStreak;
        this.buildHabitDescription();
        this.isRequest = false;
      });
  }
}
