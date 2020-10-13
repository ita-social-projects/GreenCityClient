import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-error',
  template: `
    <div>
      {{ errorMessage  | translate }}
    </div>
  `
})
export class ErrorComponent implements OnInit {
  @Input() errorMessage;
  @Input() formElement;
  ngOnInit():void {

  }

}

