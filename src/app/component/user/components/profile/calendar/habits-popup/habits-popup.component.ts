import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { calendarIcons } from 'src/app/image-pathes/calendar-icons';
import { HabitPopupInterface } from '../habit-popup-interface';

@Component({
  selector: 'app-habits-popup',
  templateUrl: './habits-popup.component.html',
  styleUrls: ['./habits-popup.component.scss']
})
export class HabitsPopupComponent implements OnInit {

  calendarIcons = calendarIcons;
  habitsCalendarSelectedDate;
  popupHabits: HabitPopupInterface[];
  trimWidth: number = 30;

  constructor(
    public dialogRef: MatDialogRef<HabitsPopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      habitsCalendarSelectedDate: string,
      habits: HabitPopupInterface[];
    }
  ) { }

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
    this.popupHabits = this.data.habits.map(x => Object.assign({}, x));
  }
  destroy = new Subject<void>();

  closePopup() {
    this.dialogRef.beforeClosed().pipe(
      takeUntil(this.destroy)
    ).subscribe(() => this.dialogRef.close(this.popupHabits));
  }

  toggleEnrollHabit(id: number) {
    const habitIndex = this.popupHabits.findIndex(h => h.habitId === id);
    this.popupHabits[habitIndex].enrolled = !this.popupHabits[habitIndex].enrolled
  }

  showTooltip(habit) {
    return habit.habitName.length < this.trimWidth;
  }
}
