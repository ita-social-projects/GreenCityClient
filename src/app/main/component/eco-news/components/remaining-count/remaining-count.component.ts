import { Component, Input } from '@angular/core';
import { WordDeclensionService } from '@global-service/word-declension/word-declension.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-remaining-count',
  templateUrl: './remaining-count.component.html',
  styleUrls: ['./remaining-count.component.scss']
})
export class RemainingCountComponent {
  @Input() public remainingCount = 0;

  constructor(public translate: TranslateService, private wordDeclensionService: WordDeclensionService) {}

  setWordDeclension(count: string): string {
    return this.wordDeclensionService.setWordDeclension(count);
  }
}
