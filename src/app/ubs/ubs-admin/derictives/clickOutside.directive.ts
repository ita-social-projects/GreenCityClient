import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, Inject, AfterViewInit, Output, OnDestroy, EventEmitter } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective implements AfterViewInit, OnDestroy {
  @Output() clickOutside = new EventEmitter<void>();

  documentClickSubscription: Subscription | undefined;

  constructor(private element: ElementRef, @Inject(DOCUMENT) private document: Document) {}

  ngAfterViewInit(): void {
    this.documentClickSubscription = fromEvent(this.document, 'click')
      .pipe(
        filter((event) => {
          return !this.isInside(event.target as HTMLElement);
        })
      )
      .subscribe(() => {
        this.clickOutside.emit();
      });
  }

  isInside(elementToCheck: HTMLElement): boolean {
    return elementToCheck === this.element.nativeElement || this.element.nativeElement.contains(elementToCheck);
  }

  ngOnDestroy(): void {
    this.documentClickSubscription?.unsubscribe();
  }
}
