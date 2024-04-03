import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-rating-display',
  templateUrl: './rating-display.component.html',
  styleUrls: ['./rating-display.component.scss']
})
export class RatingDisplayComponent {
  @Input() rate: number;
  @Input() maxRating: number;
  @Input() templateEmpthy = 'assets/events-icons/star-empthy.svg';
  @Input() templateFilled = 'assets/events-icons/star-filled.svg';
}
