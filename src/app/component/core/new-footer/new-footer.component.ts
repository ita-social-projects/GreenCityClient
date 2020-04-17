import { Component, OnInit } from '@angular/core';
import {footerIcons} from '../../../../assets/img/icon/footer/footer-icons';

@Component({
  selector: 'app-new-footer',
  templateUrl: './new-footer.component.html',
  styleUrls: ['./new-footer.component.scss']
})
export class NewFooterComponent implements OnInit {
  public actualYear = new Date().getFullYear();
  private footerImageList = footerIcons;

  constructor() { }

  ngOnInit() {
  }

}
