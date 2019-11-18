import {Component, Input, OnInit} from '@angular/core';
import {AdviceService} from '../../../../../../service/advice/advice.service';

@Component({
  selector: 'app-advice',
  templateUrl: './advice.component.html',
  styleUrls: ['./advice.component.css']
})
export class AdviceComponent implements OnInit {

  advice = 'Покладіть до кожної сумки чи рюкзаку одну еко-сумку, так вона завжди буде з вами, якщо ви неочікуванно зайдете в магазин';
  @Input()
  habitId: number;

  constructor(private service: AdviceService) { }

  ngOnInit() {
    // this.service.getAdvice(this.habitId).subscribe(data => this.advice = data.name);
  }

}
