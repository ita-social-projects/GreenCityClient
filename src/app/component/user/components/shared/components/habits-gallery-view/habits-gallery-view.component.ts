import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-habits-gallery-view',
  templateUrl: './habits-gallery-view.component.html',
  styleUrls: ['./habits-gallery-view.component.scss']
})
export class HabitsGalleryViewComponent implements OnInit {
  @Input() habit;

  constructor(public router: Router, public route: ActivatedRoute) { }

  ngOnInit() { }

  public goHabitMore(habitId) {
    this.router.navigate(['addhabit', habitId], { relativeTo: this.route });
  }
}
