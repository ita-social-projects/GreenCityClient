import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { filter, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { UbsPickUpServicePopUpComponent } from 'src/app/ubs/ubs/components/ubs-pick-up-service-pop-up/ubs-pick-up-service-pop-up.component';
import { ubsNavLinks, socialLinks } from './footer-links';
import { ubsHeaderIcons } from 'src/app/shared/image-paths/header-icons';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-ubs-footer',
  templateUrl: './ubs-footer.component.html',
  styleUrls: ['./ubs-footer.component.scss']
})
export class UbsFooterComponent implements OnInit {
  footerPicture = ubsHeaderIcons;
  screenWidth = window.innerWidth;
  currentYear = new Date().getFullYear();
  ubsNavLinks = ubsNavLinks;
  socialLinks = socialLinks;
  private _isAdminPage = this.router.url.includes('/admin');
  private readonly destroySub: Subject<boolean> = new Subject<boolean>();
  @ViewChild('serviceref') serviceref: ElementRef;

  constructor(
    private readonly dialog: MatDialog,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroySub)
      )
      .subscribe(() => {
        this._isAdminPage = this.router.url.includes('/admin');
      });
  }

  get isAdminPage(): boolean {
    return this._isAdminPage;
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
}
