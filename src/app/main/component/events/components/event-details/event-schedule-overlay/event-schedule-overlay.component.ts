import { BreakpointObserver } from '@angular/cdk/layout';
import { Overlay, OverlayRef, PositionStrategy, ScrollStrategy } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-event-schedule-overlay',
  templateUrl: './event-schedule-overlay.component.html',
  styleUrls: ['./event-schedule-overlay.component.scss']
})
export class EventScheduleOverlayComponent implements AfterViewInit, OnDestroy {
  icons = {
    clock: 'assets/img/events/clock.svg',
    location: 'assets/img/events/location.svg',
    ellipsis: 'assets/img/events/ellipsis.svg'
  };

  isOverlayOpen = false;
  isBottomSheetOpen = false;

  @Input() days = [];
  @Input() place: string;

  @ViewChild('scheduleButton') scheduleButtonRef: ElementRef;
  @ViewChild('scheduleInfoOverlay') scheduleInfoOverlayRef: TemplateRef<any>;
  overlayRef: OverlayRef = null;

  portal = null;

  breakpoints = {
    xs: '(max-width: 575px)',
    sm: '(min-width: 576px) and (max-width: 767px)',
    md: '(min-width: 768px) and (max-width: 1023px)',
    lg: '(min-width: 1024px)'
  };

  private destroy = new Subject<void>();

  constructor(private overlay: Overlay, private viewContainerRef: ViewContainerRef, private breakpointObserver: BreakpointObserver) {}

  ngAfterViewInit(): void {
    console.log(this.days);
    this.portal = new TemplatePortal(this.scheduleInfoOverlayRef, this.viewContainerRef);
    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      panelClass: 'event-schedule-overlay',
      backdropClass: 'event-schedule-overlay-backdrop',
      disposeOnNavigation: true,
      positionStrategy: this.getOverlayPositionStrategy(),
      scrollStrategy: this.getOverlayScrollStrategy()
    });
    this.overlayRef
      .backdropClick()
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.overlayRef.detach();
        this.isOverlayOpen = false;
        this.isBottomSheetOpen = false;
      });

    const screenBreakpointChanges = this.breakpointObserver.observe(Object.values(this.breakpoints));
    screenBreakpointChanges.pipe(takeUntil(this.destroy)).subscribe(() => {
      if (!this.overlayRef) {
        return;
      }

      if (!this.isOverlayOpen && !this.isBottomSheetOpen) {
        return;
      }

      if (this.breakpointObserver.isMatched(this.breakpoints.xs)) {
        this.isOverlayOpen = false;
        this.overlayRef.detach();

        this.isBottomSheetOpen = true;
      } else {
        this.isBottomSheetOpen = false;

        this.overlayRef.detach();
        this.overlayRef.attach(this.portal);
        this.overlayRef.updatePositionStrategy(this.getOverlayPositionStrategy());
        this.overlayRef.updateScrollStrategy(this.getOverlayScrollStrategy());
        this.isOverlayOpen = true;
      }
    });
  }

  getOverlayPositionStrategy(): PositionStrategy {
    let strategy: PositionStrategy = this.overlay.position().global().centerHorizontally().bottom();
    if (this.breakpointObserver.isMatched(this.breakpoints.sm)) {
      strategy = this.overlay
        .position()
        .flexibleConnectedTo(this.scheduleButtonRef)
        .withPositions([
          {
            originX: 'end',
            originY: 'bottom',
            overlayX: 'end',
            overlayY: 'top',
            offsetX: 24
          },
          {
            originX: 'end',
            originY: 'top',
            overlayX: 'end',
            overlayY: 'bottom',
            offsetX: 24
          }
        ]);
    }
    if (this.breakpointObserver.isMatched(this.breakpoints.md)) {
      strategy = this.overlay
        .position()
        .flexibleConnectedTo(this.scheduleButtonRef)
        .withPositions([
          {
            originX: 'end',
            originY: 'bottom',
            overlayX: 'end',
            overlayY: 'top',
            offsetX: 50
          },
          {
            originX: 'end',
            originY: 'top',
            overlayX: 'end',
            overlayY: 'bottom',
            offsetX: 50
          }
        ]);
    }
    if (this.breakpointObserver.isMatched(this.breakpoints.lg)) {
      strategy = this.overlay
        .position()
        .flexibleConnectedTo(this.scheduleButtonRef)
        .withPositions([
          {
            originX: 'center',
            originY: 'bottom',
            overlayX: 'center',
            overlayY: 'top'
          },
          {
            originX: 'center',
            originY: 'top',
            overlayX: 'center',
            overlayY: 'bottom'
          }
        ]);
    }
    return strategy;
  }

  getOverlayScrollStrategy(): ScrollStrategy {
    let strategy: ScrollStrategy = this.overlay.scrollStrategies.block();
    if (this.breakpointObserver.isMatched(this.breakpoints.lg)) {
      strategy = this.overlay.scrollStrategies.reposition();
    }
    return strategy;
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  onScheduleClick(): void {
    if (this.breakpointObserver.isMatched(this.breakpoints.xs)) {
      this.isBottomSheetOpen = true;
      return;
    }

    this.isOverlayOpen = true;
    this.overlayRef.attach(this.portal);
    this.overlayRef.updatePositionStrategy(this.getOverlayPositionStrategy());
    this.overlayRef.updateScrollStrategy(this.getOverlayScrollStrategy());
  }
}
