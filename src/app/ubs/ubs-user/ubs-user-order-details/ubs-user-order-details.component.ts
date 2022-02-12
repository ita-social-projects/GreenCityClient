import { Component, Input } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';

@Component({
  selector: 'app-ubs-user-order-details',
  templateUrl: './ubs-user-order-details.component.html',
  styleUrls: ['./ubs-user-order-details.component.scss']
})
export class UbsUserOrderDetailsComponent {
  @Input()
  order: any;
  public currentLanguage: string;

  constructor(private localStorageService: LocalStorageService) {
    this.currentLanguage = this.localStorageService.getCurrentLanguage();
  }
}
