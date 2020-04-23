import { Component, OnInit } from '@angular/core';
import { footerIcons } from '../../../../assets/img/icon/footer/footer-icons';
import {LocalStorageService} from '../../../service/localstorage/local-storage.service';

@Component({
  selector: 'app-new-footer',
  templateUrl: './new-footer.component.html',
  styleUrls: ['./new-footer.component.scss']
})
export class NewFooterComponent implements OnInit {
  public actualYear = new Date().getFullYear();
  private footerImageList = footerIcons;
  private userId: number;

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit() {
    this.localStorageService.userIdBehaviourSubject.subscribe(userId => this.userId = userId);
  }

  getUserId(): number | string {
    return ((this.userId !== null && !isNaN(this.userId)) ? this.userId : 'not_signed-in');
  }

}
