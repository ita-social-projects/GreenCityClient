import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { calendarIcons } from 'src/app/image-pathes/calendar-icons';
import { HabitAssignInterface, HabitStatusCalendarListInterface } from 'src/app/interface/habit/habit-assign.interface';

@Component({
  selector: 'app-habits-popup',
  templateUrl: './habits-popup.component.html',
  styleUrls: ['./habits-popup.component.scss']
})
export class HabitsPopupComponent implements OnInit {
  // public habits: HabitAssignInterface[];
  isFetching: boolean;

  calendarIcons = calendarIcons;

  habitsCalendarSelectedDate;
  habits: any[];

  constructor(
    // public habitAssignService: HabitAssignService,
    public dialogRef: MatDialogRef<HabitsPopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      habitsCalendarSelectedDate: string,
      habits: any[]
    }
  ) { }

  ngOnInit() {
    this.loadPopup();
    this.closePopup();
  }

  loadPopup() {
    this.habitsCalendarSelectedDate = this.data.habitsCalendarSelectedDate;
    this.habits = this.data.habits.map(x => Object.assign({}, x));
  }

  closePopup() {
    this.dialogRef.beforeClosed().subscribe(() => this.dialogRef.close(this.habits));
  }

  toggleEnrollHabit(id: number) {
    const habitIndex = this.habits.findIndex(h => h.habitId === id);
    this.habits[habitIndex].enrolled = !this.habits[habitIndex].enrolled
  }

  showTooltip(habit) {
    return habit.habitName.length < 30;
  }
}
