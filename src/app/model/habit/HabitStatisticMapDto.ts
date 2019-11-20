export class HabitStatisticMapDto {
    habit: string;
    count: number;

    constructor(habit: string, count: number) {
      this.habit = habit;
      this.count = count;
    }
  }