import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
  @Input() errorCode: number;
  @Input() errorMessage: string;

  constructor() { }

  ngOnInit() {
  }

}
