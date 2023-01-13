import { animate, state, style, transition, trigger } from '@angular/animations';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const openCloseResizeAnimation = trigger('openCloseResize', [
  state(
    'open',
    style({
      height: '{{height}}px'
    }),
    { params: { height: '400' } }
  ),
  state(
    'resize',
    style({
      height: '{{resizingHeight}}px'
    }),
    { params: { resizingHeight: '*' } }
  ),
  state(
    'closed',
    style({
      height: '0'
    })
  ),
  transition('resize => open', [animate('0.3s')]),
  transition('resize => closed', [animate('0.3s')]),
  transition('open => closed', [animate('0.3s')]),
  transition('closed => open', [animate('0.3s')])
]);

@Component({
  selector: 'app-mobile-bottom-sheet',
  templateUrl: './mobile-bottom-sheet.component.html',
  styleUrls: ['./mobile-bottom-sheet.component.scss'],
  animations: [openCloseResizeAnimation]
})
export class MobileBottomSheetComponent implements AfterViewInit, OnChanges {
  @Input() height = 400;

  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();

  closeThreshold = 0.5; // % of height reduction that closes overlay

  animationState = 'closed';
  resizingHeight = this.height;

  constructor(private overlay: Overlay, private viewContainerRef: ViewContainerRef, private renderer: Renderer2) {}

  @ViewChild('bottomSheet') bottomSheetRef;
  @ViewChild('resizeHandle') resizeHandleRef: ElementRef;
  @ViewChild('bottomSheetContainer') bottomSheetContainerRef: ElementRef;
  overlayRef: OverlayRef = null;
  portal: TemplatePortal = null;

  private destroy = new Subject<void>();

  ngAfterViewInit(): void {
    this.portal = new TemplatePortal(this.bottomSheetRef, this.viewContainerRef);

    if (!this.overlayRef) {
      this.overlayRef = this.overlay.create({
        hasBackdrop: true,
        panelClass: 'mobile-bottom-sheet-overlay-panel',
        backdropClass: 'mobile-bottom-sheet-overlay-backdrop',
        disposeOnNavigation: true,
        positionStrategy: this.overlay.position().global().centerHorizontally().bottom(),
        scrollStrategy: this.overlay.scrollStrategies.block()
      });

      this.overlayRef
        .backdropClick()
        .pipe(takeUntil(this.destroy))
        .subscribe(() => {
          this.close();
        });
    }

    if (this.open) {
      setTimeout(() => {
        this.overlayRef.attach(this.portal);
        this.animationState = 'open';
      }, 0);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.overlayRef) {
      return;
    }

    if (!changes.open?.currentValue) {
      this.overlayRef.detach();
      return;
    }

    if (!this.overlayRef.hasAttached()) {
      this.overlayRef.attach(this.portal);
    }
    this.animationState = 'open';
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  onHandleTouchStart(touchStartEvent: TouchEvent): void {
    const startY = touchStartEvent.touches[0].clientY;
    let delta = 0;
    const startHeight = this.bottomSheetContainerRef.nativeElement.getBoundingClientRect().height;
    this.animationState = 'resize';
    let cleanupTouchMove = () => {};
    let cleanupTouchEnd = () => {};
    this.resizingHeight = startHeight;
    cleanupTouchMove = this.renderer.listen(this.resizeHandleRef.nativeElement, 'touchmove', (touchMoveEvent) => {
      const movedTo = touchMoveEvent.touches[0].clientY;
      delta = movedTo - startY;
      this.resizingHeight = startHeight - delta;
      this.renderer.setStyle(this.bottomSheetContainerRef.nativeElement, 'height', `${startHeight - delta}px`);
    });
    cleanupTouchEnd = this.renderer.listen(this.resizeHandleRef.nativeElement, 'touchend', (touchEndEvent) => {
      if (delta > startHeight * this.closeThreshold) {
        this.close();
      } else {
        this.animationState = 'open';
      }
      cleanupTouchMove();
      cleanupTouchEnd();
    });
  }

  close(): void {
    this.animationState = 'closed';
    this.overlayRef.detach();
    this.openChange.emit(false);
  }
}
