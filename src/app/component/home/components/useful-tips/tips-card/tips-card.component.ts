import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tips-card',
  templateUrl: './tips-card.component.html',
  styleUrls: ['./tips-card.component.scss']
})
export class TipsCardComponent implements OnInit {
  @Input() tip: { imageUrl, text };

  constructor() { }

  ngOnInit() {
  }

}
