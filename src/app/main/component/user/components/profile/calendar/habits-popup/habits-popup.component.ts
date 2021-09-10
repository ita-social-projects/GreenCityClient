import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { calendarIcons } from 'src/app/main/image-pathes/calendar-icons';
import { HabitPopupInterface } from '../habit-popup-interface';

@Component({
  selector: 'app-habits-popup',
  templateUrl: './habits-popup.component.html',
  styleUrls: ['./habits-popup.component.scss']
})
export class HabitsPopupComponent implements OnInit, OnDestroy {
  calendarIcons = calendarIcons;
  habitsCalendarSelectedDate: string;
  isHabitListEditable: boolean;
  popupHabits: HabitPopupInterface[];
  trimWidth = 30;
  destroy = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<HabitsPopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      habitsCalendarSelectedDate: string;
      isHabitListEditable: boolean;
      habits: HabitPopupInterface[];
    }
  ) {}

  ngOnInit() {
    this.loadPopup();
    this.closePopup();
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  loadPopup() {
    this.habitsCalendarSelectedDate = this.data.habitsCalendarSelectedDate;
    this.isHabitListEditable = this.data.isHabitListEditable;
    this.popupHabits = this.data.habits.map((habit) => Object.assign({}, habit));
  }

  closePopup() {
    this.dialogRef
      .beforeClosed()
      .pipe(takeUntil(this.destroy))
      .subscribe(() => this.dialogRef.close(this.popupHabits));
  }

  toggleEnrollHabit(id: number) {
    const habitIndex = this.popupHabits.findIndex((habit) => habit.habitId === id);
    this.popupHabits[habitIndex].enrolled = !this.popupHabits[habitIndex].enrolled;
  }

  showTooltip(habit) {
    return habit.habitName.length < this.trimWidth;
  }
}
