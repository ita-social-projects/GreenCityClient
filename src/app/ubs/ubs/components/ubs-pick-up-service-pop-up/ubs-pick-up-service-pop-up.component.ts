import { Component } from '@angular/core';

@Component({
  selector: 'app-ubs-pick-up-service-pop-up',
  templateUrl: './ubs-pick-up-service-pop-up.component.html',
  styleUrls: ['./ubs-pick-up-service-pop-up.component.scss']
})
export class UbsPickUpServicePopUpComponent {
  howWorksPickUp = [
    'ubs-homepage.pick-up-service.how-it-works.content.li_1',
    'ubs-homepage.pick-up-service.how-it-works.content.li_1.1',
    'ubs-homepage.pick-up-service.how-it-works.content.li_1.2',
    'ubs-homepage.pick-up-service.how-it-works.content.li_1.3',
    'ubs-homepage.pick-up-service.how-it-works.content.li_2',
    'ubs-homepage.pick-up-service.how-it-works.content.li_3'
  ];

  courierPickUp = [
    'ubs-homepage.pick-up-service.courier.content.li_1',
    'ubs-homepage.pick-up-service.courier.content.li_1.1',
    'ubs-homepage.pick-up-service.courier.content.li_1.2',
    'ubs-homepage.pick-up-service.courier.content.li_2',
    'ubs-homepage.pick-up-service.courier.content.li_2.1',
    'ubs-homepage.pick-up-service.courier.content.li_2.2',
    'ubs-homepage.pick-up-service.courier.content.li_3',
    'ubs-homepage.pick-up-service.courier.content.li_3.1'
  ];

  pricePickUp = [
    'ubs-homepage.pick-up-service.price.title',
    'ubs-homepage.pick-up-service.price.li_1',
    'ubs-homepage.pick-up-service.price.li_2',
    'ubs-homepage.pick-up-service.price.li_3'
  ];

  exstraoffer = [
    'ubs-homepage.pick-up-service.extraoffer.items.li_1',
    'ubs-homepage.pick-up-service.extraoffer.items.li_2',
    'ubs-homepage.pick-up-service.extraoffer.items.li_3',
    'ubs-homepage.pick-up-service.extraoffer.items.li_4',
    'ubs-homepage.pick-up-service.extraoffer.items.li_5'
  ];
}
