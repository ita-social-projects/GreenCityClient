import { Component, Input } from '@angular/core';
import { NgIf, NgOptimizedImage, NgSwitch, NgSwitchCase } from '@angular/common';

@Component({
  selector: 'app-status-ticks',
  standalone: true,
  imports: [NgIf, NgSwitch, NgSwitchCase, NgOptimizedImage],
  template: `
    <span class="status-ticks" *ngIf="status as vs" [class.read]="vs === 'VIEWED'">
      <ng-container [ngSwitch]="vs">
        <img *ngSwitchCase="'UNREAD'" ngSrc="/assets/icons/tick-svgrepo-com.svg" alt="unread" class="tick-icon" height="800" width="800" />
        <img
          *ngSwitchCase="'VIEWED'"
          ngSrc="/assets/icons/Blue_double_ticks.svg.png"
          alt="viewed"
          class="read-tick-icon"
          height="1920"
          width="2560"
        />
      </ng-container>
    </span>
  `
})
export class StatusTicksComponent {
  @Input() status?: 'UNREAD' | 'VIEWED';
}
