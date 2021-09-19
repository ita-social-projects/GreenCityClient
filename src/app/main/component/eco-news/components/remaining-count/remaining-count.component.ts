import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-remaining-count',
  templateUrl: './remaining-count.component.html',
  styleUrls: ['./remaining-count.component.scss']
})
export class RemainingCountComponent {
  @Input() public remainingCount = 0;

  constructor(public translate: TranslateService) {}

  setWordDeclension(count: string): string {
    const lastOne = -1;
    const lastTwo = -2;
    const suitableLastNumber = '1';
    const unsuitableLastNumber = '11';
    const suitableLastNumbers = '234';
    const unsuitableLastNumbers = ['12', '13', '14'];
    if (count.slice(lastOne) === suitableLastNumber && count.slice(lastTwo) !== unsuitableLastNumber) { return 'a'; }
    if (suitableLastNumbers.includes(count.slice(lastOne)) && !unsuitableLastNumbers.includes(count.slice(lastTwo))) { return 'b'; }
    return '';
  }
}
