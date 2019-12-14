import { Component, OnInit, ViewChild } from '@angular/core';
// tslint:disable-next-line: max-line-length
import { SwiperDirective, SwiperComponent, SwiperScrollbarInterface, SwiperPaginationInterface, SwiperConfigInterface } from 'ngx-swiper-wrapper';

@Component({
  selector: 'app-tips-list',
  templateUrl: './tips-list.component.html',
  styleUrls: ['./tips-list.component.css']
})
export class TipsListComponent implements OnInit {
  tips = [
    {
      imageUrl: 'assets/img/icon/spoon-knife.png',
      text: 'Не ходіть до магазину голодними. '
        + 'Складайте список покупок заздалегідь. Тоди ви витратите менше і не купите зайвого, що потім потрібно буде викидати'
    },
    {
      imageUrl: 'assets/img/icon/water-bottle.png',
      text: 'Не ходіть до магазину голодними. '
        + 'Складайте список покупок заздалегідь. Тоди ви витратите менше і не купите зайвого, що потім потрібно буде викидати'
    },
    {
      imageUrl: 'assets/img/icon/coffee-cup.png',
      text: 'Не ходіть до магазину голодними. '
        + 'Складайте список покупок заздалегідь. Тоди ви витратите менше і не купите зайвого, що потім потрібно буде викидати'
    },
    {
      imageUrl: 'assets/img/icon/water-bottle.png',
      text: 'Не ходіть до магазину голодними. '
        + 'Складайте список покупок заздалегідь. Тоди ви витратите менше і не купите зайвого, що потім потрібно буде викидати'
    }
  ];

  public config: SwiperConfigInterface = {
    a11y: true,
    direction: 'horizontal',
    centeredSlides: true,
    centerInsufficientSlides: true,
    slidesPerView: 4,
    loop: true,
    keyboard: false,
    mousewheel: false,
    scrollbar: false,
    navigation: {
      nextEl: '.button-next',
      prevEl: '.button-prev',
    }
  };

  @ViewChild(SwiperComponent, { static: false }) componentRef?: SwiperComponent;
  @ViewChild(SwiperDirective, { static: false }) directiveRef?: SwiperDirective;

  constructor() { }

  ngOnInit() { }
}
