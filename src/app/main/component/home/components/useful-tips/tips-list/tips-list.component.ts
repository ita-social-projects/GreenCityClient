import { Component, OnInit, ViewChild } from '@angular/core';
import { SwiperDirective, SwiperComponent, SwiperConfigInterface } from 'ngx-swiper-wrapper';

@Component({
  selector: 'app-tips-list',
  templateUrl: './tips-list.component.html',
  styleUrls: ['./tips-list.component.scss']
})
export class TipsListComponent implements OnInit {
  currentTip;
  tips: object[] = [
    {
      imageUrl: 'assets/img/icon/spoon-knife.png',
      text:
        'Не ходіть до магазину голодними. ' +
        'Складайте список покупок заздалегідь. Тоді ви витратите менше і не купите зайвого, що потім потрібно буде викидати'
    },
    {
      imageUrl: 'assets/img/icon/water-bottle.png',
      text:
        'Найперше і найпростіше − відмовитися від запакованих продуктів. Купуючи овочі чи фрукти,' +
        'я не беру пакети, а користуюся багаторазовими торбами і судочками для вологих продуктів, таких як м’ясо чи риба.'
    },
    {
      imageUrl: 'assets/img/icon/coffee-cup.png',
      text:
        'Слід намагатись збільшувати частку рослинної їжі в раціоні, натомість зменшувати' +
        'вживання продуктів із консервантами, посилювачами смаку.'
    },
    {
      imageUrl: 'assets/img/icon/water-bottle.png',
      text:
        'Посадіть дерево і підтримуйте людей, які зберігають і захищають наші ліси.' +
        'Дерева поглинають тонну СО2 протягом свого життя, очищуючи повітря'
    }
  ];

  public config: SwiperConfigInterface = {
    a11y: true,
    direction: 'horizontal',
    centeredSlides: true,
    centerInsufficientSlides: true,
    slidesPerView: 3,
    breakpoints: {
      768: {
        slidesPerView: 1
      }
    },
    loop: true,
    keyboard: false,
    mousewheel: false,
    scrollbar: false,
    navigation: {
      nextEl: '.button-next',
      prevEl: '.button-prev'
    }
  };

  @ViewChild(SwiperComponent) componentRef?: SwiperComponent;
  @ViewChild(SwiperDirective) directiveRef?: SwiperDirective;

  ngOnInit() {
    this.currentTip = this.tips[0];
  }
}
