import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
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
export class UbsFooterComponent implements OnInit {
  public footerPicture = ubsHeaderIcons;
  public screenWidth = window.innerWidth;
  public currentYear = new Date().getFullYear();
  public ubsNavLinks = ubsNavLinks;
  public socialLinks = socialLinks;
  private destroySub: Subject<boolean> = new Subject<boolean>();
  @ViewChild('serviceref') serviceref: ElementRef;

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    console.log(this.ubsNavLinks, 'ubsNavLinks');
  }

  onResize() {
    this.screenWidth = window.innerWidth;
  }

  public openAboutServicePopUp(event: Event): void {
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

  public onPressEnter(event: KeyboardEvent): void {
    event.preventDefault();
    this.openAboutServicePopUp(event);
  }
}
