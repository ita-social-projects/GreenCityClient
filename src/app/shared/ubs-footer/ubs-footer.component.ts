import { Component } from '@angular/core';
import { ubsHeaderIcons } from '../../main/image-pathes/header-icons';
import { MatDialog } from '@angular/material/dialog';
import { UbsPickUpServicePopUpComponent } from 'src/app/ubs/ubs/components/ubs-pick-up-service-pop-up/ubs-pick-up-service-pop-up.component';

@Component({
  selector: 'app-ubs-footer',
  templateUrl: './ubs-footer.component.html',
  styleUrls: ['./ubs-footer.component.scss']
})
export class UbsFooterComponent {
  public footerPicture = ubsHeaderIcons;
  public screenWidth = window.innerWidth;
  public currentYear = new Date().getFullYear();
  public ubsNavLinks = [
    { name: 'user.lower-nav-bar.sorting-rules', route: 'https://nowaste.com.ua/sort-station/', url: true },
    { name: 'user.lower-nav-bar.eco-shop', route: 'https://shop.nowaste.com.ua/', url: true }
    // { name: 'Green City', route: '/#/greenCity', url: false }
  ];

  constructor(private dialog: MatDialog) {}

  onResize() {
    this.screenWidth = window.innerWidth;
  }

  public openAboutServicePopUp(): void {
    this.dialog.open(UbsPickUpServicePopUpComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      panelClass: 'custom-dialog-container',
      backdropClass: 'background-transparent',
      height: '640px'
    });
  }
}
