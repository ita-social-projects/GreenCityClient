import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ubs-switcher',
  templateUrl: './ubs-switcher.component.html',
  styleUrls: ['./ubs-switcher.component.scss']
})
export class UbsSwitcherComponent {
  @Input() isChecked: boolean;
  @Input() isEditing: boolean;

  @Output() switchChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  get displayChecked(): boolean {
    return this.isChecked;
  }

  onChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const newValue = checkbox.checked;

    checkbox.checked = this.isChecked;

    this.switchChanged.emit(newValue);
  }
}
