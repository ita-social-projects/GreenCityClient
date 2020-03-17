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
      textUk: 'Не ходіть до магазину голодними. '
        + 'Складайте список покупок заздалегідь. Тоді ви витратите менше і не купите зайвого, що потім потрібно буде викидати.',
      textRu: 'Не ходите в магазин голодными. '
        + 'Составляйте список покупок заранее. Тогда вы потратите меньше и не купите лишнего, что потом нужно будет выбрасывать.',
      textEn: 'Do not go to the store hungry. '
        + "Make a list of purchases in advance. Then you'll spend less and won't buy the extra product you'll need to throw away."
    },
    {
      imageUrl: 'assets/img/icon/water-bottle.png',
      textUk: 'Найперше і найпростіше − відмовитися від запакованих продуктів. Купуючи овочі чи фрукти, '
        + 'я не беру пакети, а користуюся багаторазовими торбами і судочками для вологих продуктів, таких як м’ясо чи риба.',
      textRu: 'Самое первое и самое простое - отказаться от упакованных продуктов. Покупая овощи или фрукты, '
        + 'я не беру пакеты, а пользуюсь многоразовыми сумками и судочками для влажных продуктов, таких как мясо или рыба.',
      textEn: 'The best and easiest is to get away from packaged products. When buying vegetables or fruits, '
        + 'I do not take pack, but I use reusable bags and pots for wet products such as meat or fish.'
    },
    {
      imageUrl: 'assets/img/icon/coffee-cup.png',
      textUk: 'Слід намагатись збільшувати частку рослинної їжі в раціоні, натомість зменшувати '
        + 'вживання продуктів із консервантами, посилювачами смаку.',
      textRu: 'Следует пытаться увеличивать долю растительной пищи в рационе, зато уменьшать '
        + 'употребление продуктов с консервантами, усилителями вкуса.',
      textEn: 'Try to increase the share of plant foods in the diet instead of reducing '
        + 'to use of products with preservatives, flavor enhancers.'
    },
    {
      imageUrl: 'assets/img/icon/water-bottle.png',
      textUk: 'Посадіть дерево і підтримуйте людей, які зберігають і захищають наші ліси.'
        + 'Дерева поглинають тонну СО2 протягом свого життя, очищуючи повітря',
      textRu: 'Посадите дерево и поддерживайте людей, которые сохраняют и защищают наши леса. '
        + 'Деревья поглощают тонну СО2 в течение своей жизни, очищая воздух.',
      textEn: 'Plant a tree and support the people who protect and protect our forests. '
        + 'Trees absorb a ton of CO2 throughout their lives, purifying the air.'
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
