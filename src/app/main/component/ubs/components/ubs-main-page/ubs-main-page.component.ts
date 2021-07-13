import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ubs-main-page',
  templateUrl: './ubs-main-page.component.html',
  styleUrls: ['./ubs-main-page.component.scss']
})
export class UbsMainPageComponent implements OnInit {
  readonly ubsArmoredTrack = 'assets/img/ubs/armored_truck.svg';
  readonly ubsGreenGarbage = 'assets/img/ubs/green_garbage_bag.svg';
  readonly ubsBlackGarbage = 'assets/img/ubs/black_garbage_bag.svg';
  readonly ubsRectangle = 'assets/img/ubs/second_rectangle.png';
  readonly ubsPolygon = 'assets/img/ubs/polygon.svg';
  readonly ubsSignboard = 'assets/img/ubs/ubs_signboard.svg';
  priceCard = [
    {
      header: 'ubs-homepage.ubs-courier.price.price-title.li_1',
      content: 'ubs-homepage.ubs-courier.price.price-description.li_1'
    },
    {
      header: 'ubs-homepage.ubs-courier.price.price-title.li_2',
      content: 'ubs-homepage.ubs-courier.price.price-description.li_2'
    },
    {
      header: 'ubs-homepage.ubs-courier.price.price-title.li_3',
      content: 'ubs-homepage.ubs-courier.price.price-description.li_3'
    }
  ];

  stepsOrder = [
    {
      header: 'ubs-homepage.ubs-courier.price.steps-title.li_1',
      content: 'ubs-homepage.ubs-courier.price.steps-content.li_1',
      numberStep: 1
    },
    {
      header: 'ubs-homepage.ubs-courier.price.steps-title.li_2',
      content: 'ubs-homepage.ubs-courier.price.steps-content.li_2',
      numberStep: 2
    },
    {
      header: 'ubs-homepage.ubs-courier.price.steps-title.li_3',
      content: 'ubs-homepage.ubs-courier.price.steps-content.li_3',
      numberStep: 3
    },
    {
      header: 'ubs-homepage.ubs-courier.price.steps-title.li_4',
      content: 'ubs-homepage.ubs-courier.price.steps-content.li_4',
      numberStep: 4
    }
  ];

  constructor() {}

  ngOnInit() {}
}
