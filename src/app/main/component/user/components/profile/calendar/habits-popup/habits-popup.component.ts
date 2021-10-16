import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { calendarIcons } from 'src/app/main/image-pathes/calendar-icons';
import { HabitPopupInterface } from '../habit-popup-interface';
import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { HabitStatusCalendarListInterface } from '../../../../../../interface/habit/habit-assign.interface';
import { LanguageService } from '../../../../../../i18n/language.service';

@Component({
  selector: 'app-habits-popup',
  templateUrl: './habits-popup.component.html',
  styleUrls: ['./habits-popup.component.scss']
})
export class HabitsPopupComponent implements OnInit, OnDestroy {
  language: string;
  today: string;
  calendarIcons = calendarIcons;
  habitsCalendarSelectedDate: string;
  isHabitListEditable: boolean;
  popupHabits: HabitPopupInterface[];
  arrayOfDate: Array<HabitStatusCalendarListInterface>;
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

  private formatDate(date: Date): string {
    return date.toLocaleDateString().split('.').reverse().join('-');
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
