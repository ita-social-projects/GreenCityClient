import { BreakpointObserver } from '@angular/cdk/layout';
import { ConnectedPosition, Overlay, OverlayRef, PositionStrategy, ScrollStrategy } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// type MediaWidthSelector = `(min-width: ${number}px)` | `(max-width: ${number}px)` | `(min-width: ${number}px) and (max-width: ${number}px)`;

@Component({
  selector: 'app-event-schedule-info',
  templateUrl: './event-schedule-info.component.html',
  styleUrls: ['./event-schedule-info.component.scss']
})
export class EventScheduleInfoComponent implements OnInit, AfterViewInit, OnDestroy {
  icons = {
    clock: 'assets/img/events/clock.svg',
    location: 'assets/img/events/location.svg',
    ellipsis: 'assets/img/events/ellipsis.svg'
  };

  @Input() event;

  @ViewChild('scheduleButton') scheduleButtonRef;
  @ViewChild('scheduleInfo') scheduleInfoRef;
  overlayRef: OverlayRef = null;
  overlayPositionStrategy: PositionStrategy = null;
  overlayScrollStrategy: ScrollStrategy = null;

  breakpoints = {
    xs: '(max-width: 575px)',
    sm: '(min-width: 576px) and (max-width: 767px)',
    md: '(min-width: 768px) and (max-width: 1023px)',
    lg: '(min-width: 1024px)'
  };

  private destroy = new Subject<void>();

  constructor(private overlay: Overlay, private viewContainerRef: ViewContainerRef, private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.overlayPositionStrategy = this.getOverlayPositionStrategy();
    this.overlayScrollStrategy = this.getOverlayScrollStrategy();

    const screenBreakpointChanges = this.breakpointObserver.observe(Object.values(this.breakpoints));

    screenBreakpointChanges.pipe(takeUntil(this.destroy)).subscribe(() => {
      if (!this.overlayRef) {
        return;
      }

      this.overlayPositionStrategy = this.getOverlayPositionStrategy();
      this.overlayScrollStrategy = this.getOverlayScrollStrategy();
      this.overlayRef.updatePositionStrategy(this.overlayPositionStrategy);
      this.overlayRef.updateScrollStrategy(this.overlayScrollStrategy);
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
    if (!this.overlayRef) {
      this.overlayRef = this.overlay.create({
        hasBackdrop: true,
        panelClass: 'event-schedule-overlay-panel',
        backdropClass: 'event-schedule-overlay-backdrop',
        positionStrategy: this.overlayPositionStrategy,
        scrollStrategy: this.overlayScrollStrategy
      });
    }

    const portal = new TemplatePortal(this.scheduleInfoRef, this.viewContainerRef);
    this.overlayRef.attach(portal);
    this.overlayRef
      .backdropClick()
      .pipe(takeUntil(this.destroy))
      .subscribe(() => this.overlayRef.detach());
  }

  onClose() {
    this.overlayRef.detach();
  }
}
