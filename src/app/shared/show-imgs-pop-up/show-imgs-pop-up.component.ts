import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-show-imgs-pop-up',
  templateUrl: './show-imgs-pop-up.component.html',
  styleUrls: ['./show-imgs-pop-up.component.scss']
})
export class ShowImgsPopUpComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<boolean> = new Subject<boolean>();
  imgIndex: number;
  images: any;
  isNavigationArrows: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<ShowImgsPopUpComponent>
  ) {
    this.imgIndex = data.imgIndex;
    this.images = data.images.filter((img) => img.src);
    this.isNavigationArrows = this.images.length > 1;
  }

  ngOnInit(): void {
    this.dialogRef
      .keydownEvents()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((event) => {
        if (event.key === 'Escape') {
          this.dialogRef.close();
        }
        if (event.key === 'ArrowLeft') {
          this.nextImg(false);
        }
        if (event.key === 'ArrowRight') {
          this.nextImg(true);
        }
      });
    this.dialogRef
      .backdropClick()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => this.dialogRef.close());
  }

  nextImg(stepRight: boolean) {
    this.imgIndex = (this.imgIndex + (stepRight ? 1 : this.images.length - 1)) % this.images.length;
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
