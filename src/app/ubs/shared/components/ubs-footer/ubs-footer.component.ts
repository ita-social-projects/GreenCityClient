import { Component, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { UbsPickUpServicePopUpComponent } from 'src/app/ubs/ubs/components/ubs-pick-up-service-pop-up/ubs-pick-up-service-pop-up.component';
import { ubsNavLinks, socialLinks } from './footer-links';
import { ubsHeaderIcons } from 'src/app/shared/image-paths/header-icons';
import { JwtService } from '@global-service/jwt/jwt.service';

@Component({
  selector: 'app-ubs-footer',
  templateUrl: './ubs-footer.component.html',
  styleUrls: ['./ubs-footer.component.scss']
})
export class UbsFooterComponent implements OnDestroy {
  footerPicture = ubsHeaderIcons;
  screenWidth = window.innerWidth;
  currentYear = new Date().getFullYear();
  ubsNavLinks = ubsNavLinks;
  socialLinks = socialLinks;
  isUbsAdmin = false;
  private readonly destroySub: Subject<boolean> = new Subject<boolean>();
  @ViewChild('serviceref') serviceref: ElementRef;

  constructor(
    private readonly dialog: MatDialog,
    private readonly jwt: JwtService
  ) {
    this.jwt.userRole$.pipe(takeUntil(this.destroySub)).subscribe((role) => {
      this.isUbsAdmin = role === 'ROLE_UBS_EMPLOYEE';
    });
  }

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
    event.preventDefault();
    this.openAboutServicePopUp(event);
  }

  ngOnDestroy(): void {
    this.destroySub.next(true);
    this.destroySub.complete();
  }
}
