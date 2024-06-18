import { Component } from '@angular/core';
import { howWorksPickUp, courierPickUp, pricePickUp, extraoffer, minimumVolume, conditions } from './pick-up-text';

@Component({
  selector: 'app-ubs-pick-up-service-pop-up',
  templateUrl: './ubs-pick-up-service-pop-up.component.html',
  styleUrls: ['./ubs-pick-up-service-pop-up.component.scss']
})
export class UbsPickUpServicePopUpComponent {
  howWorksPickUp = howWorksPickUp;
  courierPickUp = courierPickUp;
  pricePickUp = pricePickUp;
  extraoffer = extraoffer;
  minimumVolume = minimumVolume;
  conditions = conditions;
}
