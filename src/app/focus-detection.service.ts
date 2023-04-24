import { Injectable } from '@angular/core';

const MATERIAL_COMPONENT_SELECTORS = [
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
  '.mat-select'
].join(', ');

const NAVIGATION_KEYS = ['Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

const OUTLINE_STYLE = {
  color: '#000',
  width: '2px',
  type: 'solid'
};

const OUTLINE_STYLE_STRING = `${OUTLINE_STYLE.width} ${OUTLINE_STYLE.type} ${OUTLINE_STYLE.color}`;

@Injectable({
  providedIn: 'root'
})
export class FocusDetectionService {
  private focusByKeyboard = false;

  constructor() {
    this.setupFocusDetection();
  }

  private setupFocusDetection(): void {
    document.addEventListener('mousedown', this.onMouseDown);
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('focusin', this.onFocusIn);
    document.addEventListener('focusout', this.onFocusOut);
  }

  private onMouseDown = (event: MouseEvent): void => {
    this.focusByKeyboard = false;
    this.updateOutline(event.target as HTMLElement, 'none');
  };

  private onKeyDown = (event: KeyboardEvent): void => {
    this.focusByKeyboard = NAVIGATION_KEYS.includes(event.key);
    this.updateOutline(event.target as HTMLElement, `${OUTLINE_STYLE_STRING} !important`);
  };

  private onFocusIn = (event: FocusEvent): void => {
    this.updateOutline(event.target as HTMLElement, this.focusByKeyboard ? `${OUTLINE_STYLE_STRING}` : 'none');
  };

  private onFocusOut = (event: FocusEvent): void => {
    this.updateOutline(event.target as HTMLElement, 'none');
  };

  private updateOutline(target: HTMLElement, style: string): void {
    if (this.isTargetElement(target)) {
      target.style.outline = style;
      console.log('Update outline', target, this.focusByKeyboard);
    }
  }

  private isTargetElement(target: HTMLElement): boolean {
    return (
      target instanceof HTMLInputElement ||
      target instanceof HTMLSelectElement ||
      target instanceof HTMLButtonElement ||
      target.matches(MATERIAL_COMPONENT_SELECTORS)
    );
  }
}
