import { Component, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { UbsPickUpServicePopUpComponent } from 'src/app/ubs/ubs/components/ubs-pick-up-service-pop-up/ubs-pick-up-service-pop-up.component';
import { ubsNavLinks, socialLinks } from './footer-links';
import { ubsHeaderIcons } from '../../main/image-pathes/header-icons';

@Component({
  selector: 'app-ubs-footer',
  templateUrl: './ubs-footer.component.html',
  styleUrls: ['./ubs-footer.component.scss']
})
export class UbsFooterComponent {
  footerPicture = ubsHeaderIcons;
  screenWidth = window.innerWidth;
  currentYear = new Date().getFullYear();
  ubsNavLinks = ubsNavLinks;
  socialLinks = socialLinks;
  private destroySub: Subject<boolean> = new Subject<boolean>();
  @ViewChild('serviceref') serviceref: ElementRef;

  constructor(private dialog: MatDialog) {}

  onResize() {
    this.screenWidth = window.innerWidth;
  }

  openAboutServicePopUp(event: Event): void {
    event.preventDefault();
    const matDialogRef = this.dialog.open(UbsPickUpServicePopUpComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      panelClass: 'custom-dialog-container',
      backdropClass: 'background-transparent',
      height: '640px'
    });

    matDialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroySub))
      .subscribe(() => {
        this.serviceref.nativeElement.focus();
      });
  }

  onPressEnter(event: Event): void {
    //$Event KeyboardEvent
    event.preventDefault();
    this.openAboutServicePopUp(event);
  }
}
