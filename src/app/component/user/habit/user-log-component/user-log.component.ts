import { Component, OnInit } from '@angular/core';
import { HabitStatisticService } from 'src/app/service/habit-statistic/habit-statistic.service';

@Component({
  selector: 'app-user-log',
  templateUrl: './user-log.component.html',
  styleUrls: ['./user-log.component.css'],
})
export class UserLogComponent implements OnInit {

  constructor(private habitStatisticService: HabitStatisticService) { }

  readonly package = 'assets/img/icon/package_statistic.png';
  readonly coffee = 'assets/img/icon/coffee_statistic.png';

  hasStatistic = false;

  $userLog: any;
  $creationDate: Date;
  $amountUnTakenItemsPerMonthBag: number;
  $amountUnTakenItemsPerMonthCap: number;
  $differenceUnTakenItemsWithPreviousDayBag: number;
  $differenceUnTakenItemsWithPreviousDayCap: number;

  ngOnInit() {
    this.$userLog = this.habitStatisticService.getUserLog().subscribe(data => {
      this.hasStatistic = true;
      this.$creationDate = data.creationDate;
      const cap = data.allItemsPerMonth.filter(obj => {
        return obj.habitItemName === 'cap';
      });
      const bag = data.allItemsPerMonth.filter(obj => {
        return obj.habitItemName === 'bag';
      });
      const diffBag = data.differenceUnTakenItemsWithPreviousDay.filter(obj => {
        return obj.habitItemName === 'bag';
      });
      const diffCap = data.differenceUnTakenItemsWithPreviousDay.filter(obj => {
        return obj.habitItemName === 'cap';
      });
      console.log('start1');
      console.log(cap);
      console.log(bag);
      console.log(diffBag);
      console.log(diffCap);
      console.log('end1');

      if (cap.length !== 0) {
        this.$amountUnTakenItemsPerMonthCap = cap[0].habitItemAmount;
      }
      if (bag.length !== 0) {
        this.$amountUnTakenItemsPerMonthBag = bag[0].habitItemAmount;
      }
      if (diffCap.length !== 0) {
        this.$differenceUnTakenItemsWithPreviousDayCap = diffCap[0].habitItemAmount;
      } else {
        console.log('start');
        this.$differenceUnTakenItemsWithPreviousDayCap = 0;
      }
      if (diffBag.length !== 0) {
        this.$differenceUnTakenItemsWithPreviousDayBag = diffBag[0].habitItemAmount;
      } else {
              console.log('end');

        this.$differenceUnTakenItemsWithPreviousDayBag = 0;
      }
    }, error => {
      this.hasStatistic = false;
      console.log('Error!', error);
    }
    );
  }

  nowDate() {
    const date: Date = new Date();
    return date.getDate() + ' ' + date.toLocaleString('default', { month: 'long' });
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
    return Math.floor(DifferenceInDays) > 1 ? Math.floor(DifferenceInDays) : 1;
  }

}
