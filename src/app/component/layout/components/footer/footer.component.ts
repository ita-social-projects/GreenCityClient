import { Component, OnInit } from '@angular/core';
import { footerIcons } from 'src/app/image-pathes/footer-icons';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  public actualYear = new Date().getFullYear();
  public footerImageList = footerIcons;
  private userId: number;

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit() {
    this.localStorageService.userIdBehaviourSubject.subscribe(userId => this.userId = userId);
  }

  public getUserId(): number | string {
    return ((this.userId !== null && !isNaN(this.userId)) ? this.userId : 'not_signed-in');
  }

}
