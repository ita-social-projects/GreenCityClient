import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-remaining-count',
  templateUrl: './remaining-count.component.html',
  styleUrls: ['./remaining-count.component.css']
})
export class RemainingCountComponent implements OnInit {

  private remaining = 0;

  constructor() { }

  ngOnInit() {
  }

}
