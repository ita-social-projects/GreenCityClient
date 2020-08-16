import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-remaining-count',
  templateUrl: './remaining-count.component.html',
  styleUrls: ['./remaining-count.component.scss']
})
export class RemainingCountComponent implements OnInit {
  @Input() public remainingCount = 0;

  constructor() { }

  ngOnInit() {
  }
}
