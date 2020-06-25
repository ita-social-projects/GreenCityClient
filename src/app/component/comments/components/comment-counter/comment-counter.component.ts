import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-comment-counter',
  templateUrl: './comment-counter.component.html',
  styleUrls: ['./comment-counter.component.scss']
})
export class CommentCounterComponent {
  @Input() public totalElements: number;

  constructor() { }

}
