import { Component, Input } from '@angular/core';
import { NgIf, NgForOf, DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-client-info-panel',
  standalone: true,
  imports: [NgIf, NgForOf, DatePipe, TranslateModule],
  templateUrl: './client-info-panel.component.html',
  styleUrls: ['./client-info-panel.component.scss']
})
export class ClientInfoPanelComponent {
  @Input() clientData: any = null;

  objectKeys = Object.keys;

  isPrimitive(val: any): boolean {
    return typeof val !== 'object' || val === null;
  }

  isArray(val: any): boolean {
    return Array.isArray(val);
  }

  isObject(val: any): boolean {
    return typeof val === 'object' && val !== null && !Array.isArray(val);
  }
}
