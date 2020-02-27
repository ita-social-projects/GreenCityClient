import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-eco-news',
  templateUrl: './eco-news.component.html',
  styleUrls: ['./eco-news.component.css']
})
export class EcoNewsComponent implements OnInit {

  @ViewChild("footerElement", { static: true }) footer: ElementRef;
  quantity;
  current;
  number = 1;
  options = {
    rootMargin: '0px',
    threshold: 0
  };

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0) {
        if (this.current < this.quantity) {
          this.number++;
        }
      }
    });
  }, this.options);

  constructor(private titleService: Title) {
  }

  ngAfterViewInit() {
    this.observer.observe(this.footer.nativeElement)
  }

  ngOnInit() {
    this.titleService.setTitle('Eco News');}

  setQuantity(event) {
    this.quantity = event;
    console.log(this.quantity);
  }

  setCurrent(event) {
    this.current = event;
    console.log(this.current);
  }

  changeView() { }
}
