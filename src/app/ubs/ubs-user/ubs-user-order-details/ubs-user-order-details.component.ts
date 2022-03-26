import { Component, Input } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { IUserOrderInfo } from '../ubs-user-orders-list/models/UserOrder.interface';

@Component({
  selector: 'app-ubs-user-order-details',
  templateUrl: './ubs-user-order-details.component.html',
  styleUrls: ['./ubs-user-order-details.component.scss']
})
export class UbsUserOrderDetailsComponent {
  @Input()
  order: IUserOrderInfo;
  public currentLanguage: string;

  constructor(private localStorageService: LocalStorageService) {
    this.currentLanguage = this.localStorageService.getCurrentLanguage();
  }
}
