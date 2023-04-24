import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FocusDetectionService {
  private focusByKeyboard = false;
  materialComponentSelectors = [
    '.mat-button',
    '.mat-raised-button',
    '.mat-flat-button',
    '.mat-icon-button',
    '.mat-fab',
    '.mat-mini-fab',
    '.mat-menu-item',
    '.mat-list-item',
    '.mat-radio-button',
    '.mat-checkbox',
    '.mat-slider',
    '.mat-slide-toggle',
    '.mat-select',
    'button'
  ].join(', ');

  constructor() {
    this.setupFocusDetection();
  }

  private setupFocusDetection(): void {
    document.addEventListener('mousedown', (event) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLSelectElement ||
        event.target instanceof HTMLButtonElement ||
        (event.target as HTMLElement).matches(this.materialComponentSelectors)
      ) {
        (event.target as HTMLElement).style.outline = 'none';
      }
    });

    document.addEventListener('keydown', (event) => {
      const navigationKeys = ['Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
      if (navigationKeys.includes(event.key)) {
        this.focusByKeyboard = true;
      } else {
        this.focusByKeyboard = false;
      }

      if (
        this.focusByKeyboard &&
        (event.target instanceof HTMLInputElement ||
          event.target instanceof HTMLSelectElement ||
          event.target instanceof HTMLButtonElement ||
          (event.target as HTMLElement).matches(this.materialComponentSelectors))
      ) {
        (event.target as HTMLElement).style.outline = '2px solid black !important';
      }
    });

    document.addEventListener('focusin', (event) => {
      if (
        this.focusByKeyboard &&
        (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement || event.target instanceof HTMLButtonElement)
      ) {
        (event.target as HTMLElement).style.outline = '2px solid black';
      }
    });

    document.addEventListener('focusout', (event) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLSelectElement ||
        event.target instanceof HTMLButtonElement
      ) {
        (event.target as HTMLElement).style.outline = 'none';
      }
    });
  }
}
