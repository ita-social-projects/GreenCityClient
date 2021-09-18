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
    if (count.slice(-1) === '1' && count.slice(-2) !== '11') {
      return 'ends_on_1';
    } else if ('234'.includes(count.slice(-1)) && !['12', '13', '14'].includes(count.slice(-2))) {
      return 'ends_on_2_3_4';
    } else {
      return '';
    }
  }
}
