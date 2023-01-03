import { BreakpointObserver } from '@angular/cdk/layout';
import { Overlay, OverlayRef, PositionStrategy, ScrollStrategy } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// type MediaWidthSelector = `(min-width: ${number}px)` | `(max-width: ${number}px)` | `(min-width: ${number}px) and (max-width: ${number}px)`;

@Component({
  selector: 'app-event-schedule-overlay',
  templateUrl: './event-schedule-overlay.component.html',
  styleUrls: ['./event-schedule-overlay.component.scss']
})
export class EventScheduleOverlayComponent implements OnInit, AfterViewInit, OnDestroy {
  icons = {
    clock: 'assets/img/events/clock.svg',
    location: 'assets/img/events/location.svg',
    ellipsis: 'assets/img/events/ellipsis.svg'
  };

  isScheduleOpen = false;

  isBottomSheetOpen = false;

  @Input() event;

  @ViewChild('scheduleButton') scheduleButtonRef;
  @ViewChild('scheduleInfoOverlay') scheduleInfoOverlayRef;
  overlayRef: OverlayRef = null;
  // overlayPositionStrategy: PositionStrategy = null;
  // overlayScrollStrategy: ScrollStrategy = null;

  portal = null;

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
    this.portal = new TemplatePortal(this.scheduleInfoOverlayRef, this.viewContainerRef);

    const screenBreakpointChanges = this.breakpointObserver.observe(Object.values(this.breakpoints));

    screenBreakpointChanges.pipe(takeUntil(this.destroy)).subscribe(() => {
      if (!this.overlayRef || !this.isScheduleOpen) {
        return;
      }

      if (this.overlayRef.hasAttached()) {
        this.overlayRef.dispose();
      }

      if (this.getCurrentBreakpoint() === 'xs') {
        this.isBottomSheetOpen = true;
      } else {
        this.isBottomSheetOpen = false;
        this.overlayRef = this.createOverlay();
      }

      // 'xs' => *\'xs' : open = false; attach portal
      // *\'xs' => 'xs': detach portal; open = true
      // *\'xs' => *\'xs' do nothing
    });
  }

  onBottomSheetClosed() {
    this.isBottomSheetOpen = false;
  }

  getCurrentBreakpoint() {
    let breakpoint = 'xs';
    breakpoint = this.breakpointObserver.isMatched(this.breakpoints.xs) ? 'xs' : breakpoint;
    breakpoint = this.breakpointObserver.isMatched(this.breakpoints.sm) ? 'sm' : breakpoint;
    breakpoint = this.breakpointObserver.isMatched(this.breakpoints.md) ? 'md' : breakpoint;
    breakpoint = this.breakpointObserver.isMatched(this.breakpoints.lg) ? 'lg' : breakpoint;
    return breakpoint;
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
    this.isScheduleOpen = true;
    // const portal = new TemplatePortal(this.scheduleInfoOverlayRef, this.viewContainerRef);
    if (this.getCurrentBreakpoint() === 'xs') {
      this.isBottomSheetOpen = true;
      return;
    }

    this.overlayRef = this.createOverlay();
  }

  createOverlay() {
    const overlayRef = this.overlay.create({
      hasBackdrop: true,
      panelClass: 'event-schedule-overlay',
      backdropClass: 'event-schedule-overlay-backdrop',
      disposeOnNavigation: true,
      positionStrategy: this.getOverlayPositionStrategy(),
      scrollStrategy: this.getOverlayScrollStrategy()
    });
    overlayRef.attach(this.portal);
    overlayRef
      .backdropClick()
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.overlayRef.dispose();
        this.isScheduleOpen = false;
      });
    return overlayRef;
  }

  onClose(event) {
    console.log(event);
    this.overlayRef.detach();
    this.isScheduleOpen = false;
  }

  // onHandleTouchStart(touchStartEvent) {
  //   const startY = touchStartEvent.touches[0].clientY;
  //   // this.renderer.setStyle(this.scheduleInfoContainerRef.nativeElement, 'height', '500px');
  //   let delta = 0;
  //   const startHeight = this.scheduleInfoContainerRef.nativeElement.getBoundingClientRect().height;
  //   this.animationState = 'resize';
  //   let cleanupTouchMove = () => {};
  //   let cleanupTouchEnd = () => {};
  //   this.resizingHeight = startHeight;
  //   cleanupTouchMove = this.renderer.listen(this.resizeHandleRef.nativeElement, 'touchmove', (touchMoveEvent) => {
  //     const movedTo = touchMoveEvent.touches[0].clientY;
  //     delta = movedTo - startY;
  //     this.resizingHeight = startHeight - delta;
  //     console.log(this.resizingHeight);
  //     this.renderer.setStyle(this.scheduleInfoContainerRef.nativeElement, 'height', `${startHeight - delta}px`);
  //   });
  //   cleanupTouchEnd = this.renderer.listen(this.resizeHandleRef.nativeElement, 'touchend', (touchEndEvent) => {
  //     if (delta > startHeight * 0.5) {
  //       this.animationState = 'closed';
  //       this.overlayRef.detach();
  //     } else {
  //       this.animationState = 'open';
  //     }
  //     cleanupTouchMove();
  //     cleanupTouchEnd();
  //   });
  // }

  // onDrag() {
  //   console.log('drag');
  // }
}
