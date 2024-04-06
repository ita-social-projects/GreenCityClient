import { Component, Input, OnInit } from '@angular/core';
import { VisionCard } from '../../models/vision-card.interface';

@Component({
  selector: 'app-vision-card',
  templateUrl: './vision-card.component.html',
  styleUrls: ['./vision-card.component.scss']
})
export class VisionCardComponent implements OnInit {
  @Input() card: VisionCard;

  constructor() {}

  ngOnInit(): void {}

  get isEven(): boolean {
    return this.card.id % 2 === 0;
  }

  get numberSrc() {
    return `../../../../assets/img/${this.card.id}.png`;
  }
}
