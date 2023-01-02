import { BreakpointObserver } from '@angular/cdk/layout';
import { ConnectedPosition, Overlay, OverlayRef, PositionStrategy, ScrollStrategy } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// type MediaWidthSelector = `(min-width: ${number}px)` | `(max-width: ${number}px)` | `(min-width: ${number}px) and (max-width: ${number}px)`;

import { trigger, state, style, transition, animate, group, query, stagger, keyframes } from '@angular/animations';

export const SlideInOutAnimation = [
  trigger('slideInOut', [
    state(
      'in',
      style({
        'max-height': '500px',
        opacity: '1',
        visibility: 'visible'
      })
    ),
    state(
      'out',
      style({
        'max-height': '0px',
        opacity: '0',
        visibility: 'hidden'
      })
    ),
    transition('in => out', [
      group([
        animate(
          '400ms ease-in-out',
          style({
            opacity: '0'
          })
        ),
        animate(
          '600ms ease-in-out',
          style({
            'max-height': '0px'
          })
        ),
        animate(
          '700ms ease-in-out',
          style({
            visibility: 'hidden'
          })
        )
      ])
    ]),
    transition('out => in', [
      group([
        animate(
          '1ms ease-in-out',
          style({
            visibility: 'visible'
          })
        ),
        animate(
          '600ms ease-in-out',
          style({
            'max-height': '500px'
          })
        ),
        animate(
          '800ms ease-in-out',
          style({
            opacity: '1'
          })
        )
      ])
    ])
  ])
];

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

  @Input() event;

  @ViewChild('scheduleButton') scheduleButtonRef;
  @ViewChild('scheduleInfoOverlay') scheduleInfoOverlayRef;
  @ViewChild('scheduleInfoBottomSheet') scheduleInfoBottomSheetRef;
  @ViewChild('resizeHandle') resizeHandleRef: ElementRef;
  @ViewChild('scheduleInfoContainer') scheduleInfoContainerRef: ElementRef;
  overlayRef: OverlayRef = null;
  overlayPositionStrategy: PositionStrategy = null;
  overlayScrollStrategy: ScrollStrategy = null;

  portals = {
    overlay: null,
    bottomSheet: null
  };

  breakpoints = {
    xs: '(max-width: 575px)',
    sm: '(min-width: 576px) and (max-width: 767px)',
    md: '(min-width: 768px) and (max-width: 1023px)',
    lg: '(min-width: 1024px)'
  };

  currentBreakpoint = 'xs';

  private destroy = new Subject<void>();

  constructor(
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private breakpointObserver: BreakpointObserver,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.portals = {
      overlay: new TemplatePortal(this.scheduleInfoOverlayRef, this.viewContainerRef),
      bottomSheet: new TemplatePortal(this.scheduleInfoBottomSheetRef, this.viewContainerRef)
    };

    this.currentBreakpoint = this.getCurrentBreakpoint();
    this.overlayPositionStrategy = this.getOverlayPositionStrategy();
    this.overlayScrollStrategy = this.getOverlayScrollStrategy();

    const screenBreakpointChanges = this.breakpointObserver.observe(Object.values(this.breakpoints));

    screenBreakpointChanges.pipe(takeUntil(this.destroy)).subscribe(() => {
      if (!this.overlayRef) {
        return;
      }

      this.currentBreakpoint = this.getCurrentBreakpoint();
      this.overlayPositionStrategy = this.getOverlayPositionStrategy();
      this.overlayScrollStrategy = this.getOverlayScrollStrategy();
      this.overlayRef.updatePositionStrategy(this.overlayPositionStrategy);
      this.overlayRef.updateScrollStrategy(this.overlayScrollStrategy);

      if (this.overlayRef && this.overlayRef.hasAttached()) {
        this.overlayRef.detach();
        this.overlayRef.attach(this.currentBreakpoint === 'xs' ? this.portals.bottomSheet : this.portals.overlay);
      }
    });
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
    // this.bottomSheetRef = this.bottomSheet.open(this.scheduleInfoRef);
    if (!this.overlayRef) {
      this.overlayRef = this.overlay.create({
        hasBackdrop: true,
        panelClass: 'event-schedule-overlay',
        backdropClass: 'event-schedule-overlay-backdrop',
        disposeOnNavigation: true,
        positionStrategy: this.overlayPositionStrategy,
        scrollStrategy: this.overlayScrollStrategy
      });
    }

    // const portal = new TemplatePortal(this.scheduleInfoOverlayRef, this.viewContainerRef);
    this.overlayRef.attach(this.currentBreakpoint === 'xs' ? this.portals.bottomSheet : this.portals.overlay);
    this.overlayRef
      .backdropClick()
      .pipe(takeUntil(this.destroy))
      .subscribe(() => this.overlayRef.detach());
  }

  onClose(event) {
    console.log(event);
    // console.log('event');
    this.overlayRef.detach();
    // this.bottomSheetRef.dismiss();
  }

  onHandleTouchStart(touchStartEvent) {
    const startY = touchStartEvent.touches[0].clientY;
    // this.renderer.setStyle(this.scheduleInfoContainerRef.nativeElement, 'height', '500px');
    let delta = 0;
    const startHeight = this.scheduleInfoContainerRef.nativeElement.getBoundingClientRect().height;
    let cleanupTouchMove = () => {};
    let cleanupTouchEnd = () => {};
    cleanupTouchMove = this.renderer.listen(this.resizeHandleRef.nativeElement, 'touchmove', (touchMoveEvent) => {
      const movedTo = touchMoveEvent.touches[0].clientY;
      const delta = movedTo - startY;
      this.renderer.setStyle(this.scheduleInfoContainerRef.nativeElement, 'height', `${startHeight - delta}px`);
    });
    cleanupTouchEnd = this.renderer.listen(this.resizeHandleRef.nativeElement, 'touchend', (touchEndEvent) => {
      cleanupTouchMove();
      cleanupTouchEnd();
    });
  }

  // onDrag() {
  //   console.log('drag');
  // }
}
