import { Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from 'events';
import { UiActionsService } from 'src/app/service/ui-actions/ui-actions.service';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
  constructor() { }

  ngOnInit() { }
}
