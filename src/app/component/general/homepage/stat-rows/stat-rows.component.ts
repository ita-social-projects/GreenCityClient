import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stat-rows',
  templateUrl: './stat-rows.component.html',
  styleUrls: ['./stat-rows.component.css']
})
export class StatRowsComponent implements OnInit {

  // TODO Create entity for habitStatItem

  readonly homePageHabitStats = [
    {
      action: 'Не взяли',
      caption: 'пакетів',
      count: 85,
      question: 'А скільки пакетів ти не взяв сьогодні?',
      iconPath: 'assets/img/habit-pic-bag.png',
      locationText: 'тут можна купити еко-сумочки і торбинки'
    },
    {
      action: 'Не викинули',
      caption: 'склянок',
      count: 78,
      question: 'А скільки склянок не викинув сьогодні ти?',
      iconPath: 'assets/img/habit-pic-cup.png',
      locationText: 'заклади, які роблять знижку на напій в своє горнятко'
    }
  ];

  constructor() { }

  ngOnInit() { }
}
