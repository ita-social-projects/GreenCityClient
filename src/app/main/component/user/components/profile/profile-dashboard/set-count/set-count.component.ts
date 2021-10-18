import { Component, Input } from '@angular/core';
import { WordDeclensionService } from '@global-service/word-declension/word-declension.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-set-count',
  templateUrl: './set-count.component.html',
  styleUrls: ['./set-count.component.scss']
})
export class SetCountComponent {
  @Input() public remainingCount = 0;
  @Input() public tabName: string;

  localizationSet = {
    habits: ['profile.dashboard.habits.habit-at-1', 'profile.dashboard.habits.habit-at-2-3-4', 'profile.dashboard.habits.habit-at-all'],
    news: ['profile.dashboard.news.news-at-1', 'profile.dashboard.news.news-at-2-3-4', 'profile.dashboard.news.news-at-all']
  };

  constructor(public translate: TranslateService, private wordDeclensionService: WordDeclensionService) {}

  setWordDeclension(count: string): string {
    return this.wordDeclensionService.setWordDeclension(count);
  }
}
