import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { calendarIcons } from 'src/app/main/image-pathes/calendar-icons';
import { HabitPopupInterface } from '../habit-popup-interface';
import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { HabitAssignInterface, HabitStatusCalendarListInterface } from '../../../../../../interface/habit/habit-assign.interface';
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
    public habitAssignService: HabitAssignService,
    public languageService: LanguageService,
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
    this.language = this.languageService.getCurrentLanguage();
    this.habitsCalendarSelectedDate = this.data.habitsCalendarSelectedDate;
    this.isHabitListEditable = this.data.isHabitListEditable;
    this.popupHabits = this.data.habits.map((habit) => Object.assign({}, habit));
    this.today = this.formatSelectedDate(new Date()).toString();
  }

  closePopup() {
    this.dialogRef
      .beforeClosed()
      .pipe(takeUntil(this.destroy))
      .subscribe(() => this.dialogRef.close(this.popupHabits));
  }

  formatSelectedDate(date) {
    const monthLow = date.toLocaleDateString(this.language, { month: 'long' });
    const month = monthLow.charAt(0).toUpperCase() + monthLow.slice(1);
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  }

  setHabitArrayDate(habitArray: Array<HabitAssignInterface>, id) {
    habitArray.find((item) => item.habit.id === id).habitStatusCalendarDtoList = this.arrayOfDate;
    if (habitArray === this.habitAssignService.habitsInProgressToView) {
      this.habitAssignService.habitsInProgressToView = habitArray.map((obj) => ({ ...obj }));
    } else {
      this.habitAssignService.habitsInProgress = habitArray.map((obj) => ({ ...obj }));
    }
  }

  setCircleFromPopUpToCards(id: number, habitIndex: number) {
    if (this.habitsCalendarSelectedDate === this.today) {
      this.arrayOfDate = this.habitAssignService.habitsInProgress.find((item) => item.habit.id === id).habitStatusCalendarDtoList;
      if (this.popupHabits[habitIndex].enrolled) {
        this.arrayOfDate.push({
          enrollDate: this.formatDate(new Date()),
          id: null
        });
      } else {
        this.arrayOfDate = this.arrayOfDate.filter((item) => item.enrollDate !== this.formatDate(new Date()));
      }
      this.habitAssignService.habitsInProgressToView.find((item) => item.habit.id === id) !== undefined
        ? this.setHabitArrayDate(this.habitAssignService.habitsInProgressToView, id)
        : this.setHabitArrayDate(this.habitAssignService.habitsInProgress, id);
    }
  }

  toggleEnrollHabit(id: number) {
    const habitIndex = this.popupHabits.findIndex((habit) => habit.habitId === id);
    this.popupHabits[habitIndex].enrolled = !this.popupHabits[habitIndex].enrolled;
    this.setCircleFromPopUpToCards(id, habitIndex);
  }

  showTooltip(habit) {
    return habit.habitName.length < this.trimWidth;
  }
}
