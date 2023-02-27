import { Component } from '@angular/core';
import { howWorksPickUp, courierPickUp, pricePickUp, extraoffer, minimumVolume, conditions } from './pick-up-text';

@Component({
  selector: 'app-ubs-pick-up-service-pop-up',
  templateUrl: './ubs-pick-up-service-pop-up.component.html',
  styleUrls: ['./ubs-pick-up-service-pop-up.component.scss']
})
export class UbsPickUpServicePopUpComponent {
  public howWorksPickUp = howWorksPickUp;
  public courierPickUp = courierPickUp;
  public pricePickUp = pricePickUp;
  public extraoffer = extraoffer;
  public minimumVolume = minimumVolume;
  public conditions = conditions;
}
