import { Component, Input } from '@angular/core';
import { VisionCard } from '../../models/vision-card.interface';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-vision-card',
  templateUrl: './vision-card.component.html',
  styleUrls: ['./vision-card.component.scss']
})
export class VisionCardComponent {
  private userId: number;
  @Input() card: VisionCard;

  constructor(private readonly localStorageService: LocalStorageService) {}

  getDynamicLink(): string[] {
    if (this.card.linkPath[0] === '/greenCity/profile') {
      this.localStorageService.userIdBehaviourSubject.pipe(take(1)).subscribe((id) => (this.userId = id));
      return [`/greenCity/profile/${this.userId}/friends`];
    }
    return this.card.linkPath;
  }

  get isEven(): boolean {
    return this.card.id % 2 === 0;
  }
}
