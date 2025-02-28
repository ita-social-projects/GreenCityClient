import { Component, Input } from '@angular/core';
import { VisionCard } from '../../models/vision-card.interface';

@Component({
  selector: 'app-vision-card',
  templateUrl: './vision-card.component.html',
  styleUrls: ['./vision-card.component.scss']
})
export class VisionCardComponent {
  @Input() card: VisionCard;

  get isEven(): boolean {
    return this.card.id % 2 === 0;
  }
}
