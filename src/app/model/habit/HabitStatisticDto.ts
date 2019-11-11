export class HabitStatisticDto {
  habitName: string;
  countHabit: number;
  date: Date;

  constructor(habitName: string, habitItemCount: number) {
    this.habitName = habitName;
    this.countHabit = habitItemCount;
  }
}
