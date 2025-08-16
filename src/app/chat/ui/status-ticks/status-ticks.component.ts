import { Component, Input } from '@angular/core';
import { NgIf, NgSwitch, NgSwitchCase } from '@angular/common';

@Component({
  selector: 'app-status-ticks',
  standalone: true,
  imports: [NgIf, NgSwitch, NgSwitchCase],
  template: `
    <span class="status-ticks" *ngIf="status as vs" [class.read]="vs === 'VIEWED'">
      <ng-container [ngSwitch]="vs">
        <img *ngSwitchCase="'UNREAD'" src="../../../../assets/icons/tick-svgrepo-com.svg" alt="unread" class="tick-icon" />
        <img *ngSwitchCase="'VIEWED'" src="../../../../assets/icons/Blue_double_ticks.svg.png" alt="viewed" class="read-tick-icon" />
      </ng-container>
    </span>
  `
})
export class StatusTicksComponent {
  @Input() status?: 'UNREAD' | 'VIEWED';
}
