import { HabitStatisticMapDto } from '../habit/HabitStatisticMapDto';
export class HabitStatisticLogDto {
  createDate: Date;
  amountUnTakenItemsPerMonth: HabitStatisticMapDto;
  differenceUnTakenItemsWithPreviousMonth: HabitStatisticMapDto;

  constructor(
    createDate: Date,
    amountUnTakenItemsPerMonth: HabitStatisticMapDto,
    differenceUnTakenItemsWithPreviousMonth: HabitStatisticMapDto
  ) {
    this.createDate = createDate;
    this.amountUnTakenItemsPerMonth = amountUnTakenItemsPerMonth;
    this.differenceUnTakenItemsWithPreviousMonth = differenceUnTakenItemsWithPreviousMonth;
  }
}
