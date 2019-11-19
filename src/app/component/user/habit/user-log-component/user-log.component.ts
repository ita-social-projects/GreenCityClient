import { Component, OnInit} from '@angular/core';
import { HabitStatisticService } from 'src/app/service/habit-statistic/habit-statistic.service';
import { daLocale } from 'ngx-bootstrap';

@Component({
  selector: 'app-user-log',
  templateUrl: './user-log.component.html',
  styleUrls: ['./user-log.component.css'],
})
export class UserLogComponent implements OnInit {

  constructor(private habitStatisticService: HabitStatisticService) { }

  $userLog: any;
  $creationDate: Date;
  $amountUnTakenItemsPerMonthBag: number;
  $amountUnTakenItemsPerMonthCap: number;
  $differenceUnTakenItemsWithPreviousMonthBag: number;
  $differenceUnTakenItemsWithPreviousMonthCap: number;

  ngOnInit() {
      this.$userLog = this.habitStatisticService.getUserLog().subscribe(data => {
      this.$creationDate = data.creationDate,
      this.$amountUnTakenItemsPerMonthBag = data.amountUnTakenItemsPerMonth.bag,
      this.$amountUnTakenItemsPerMonthCap = data.amountUnTakenItemsPerMonth.cap,
      this.$differenceUnTakenItemsWithPreviousMonthBag =  data.differenceUnTakenItemsWithPreviousMonth.bag,
      this.$differenceUnTakenItemsWithPreviousMonthCap = data.differenceUnTakenItemsWithPreviousMonth.cap;
     });
  }

  nowDate() {
    const date: Date = new Date();
    return date.getDate() + ' ' +   date.toLocaleString('default', { month: 'long' });
  }

  countDay() {
    const date: Date = new Date();
    return date.getDate();
  }

  checkCountForMonth(countHabit: number) {
    return Math.abs(countHabit);
  }

  countDayInCycle() {
    const dateNow = new Date();
    const dateFromDateBase = new Date(this.$creationDate);
    const DifferenceInTime = dateNow.getTime() - dateFromDateBase.getTime();
    const DifferenceInDays = DifferenceInTime / (1000 * 3600 * 24);
    return Math.floor(DifferenceInDays);
  }

}
