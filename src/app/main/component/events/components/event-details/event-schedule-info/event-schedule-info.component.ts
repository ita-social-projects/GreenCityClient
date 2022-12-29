import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { Component, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-event-schedule-info',
  templateUrl: './event-schedule-info.component.html',
  styleUrls: ['./event-schedule-info.component.scss']
})
export class EventScheduleInfoComponent implements OnDestroy {
  icons = {
    clock: 'assets/img/events/clock.svg',
    location: 'assets/img/events/location.svg',
    ellipsis: 'assets/img/events/ellipsis.svg'
  };

  @Input() event;

  @ViewChild('scheduleButton') scheduleButtonRef;
  @ViewChild('scheduleInfo') scheduleInfoRef;
  overlayRef: OverlayRef = null;

  private destroy = new Subject<void>();

  constructor(private overlay: Overlay, private viewContainerRef: ViewContainerRef) {}

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  onScheduleClick(): void {
    const positionStrategy = this.overlay
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

    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      panelClass: 'event-schedule-overlay-panel',
      backdropClass: 'event-schedule-overlay-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy
    });
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
