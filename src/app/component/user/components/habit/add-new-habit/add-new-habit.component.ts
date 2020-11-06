import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerHabitItemPageModel } from '@global-user/models/habit-item.model';
import { Subscription } from 'rxjs';
import { AddNewHabitService } from './services/add-new-habit.service';

@Component({
  selector: 'app-add-new-habit',
  templateUrl: './add-new-habit.component.html',
  styleUrls: ['./add-new-habit.component.scss']
})
export class AddNewHabitComponent implements OnInit {
  public habit: ServerHabitItemPageModel;
  public habitID: number;
  public userID: number;
  public galleryView = true;
  public subscription: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private addHabitService: AddNewHabitService) {
                this.route.params.subscribe(params => {
                  this.habitID = +params.habitId;
                  this.userID = +params.id;
                });
              }

  ngOnInit() {
    this.getHabitById(this.habitID);
  }

  getHabitById(id: number): any {
    this.addHabitService.getHabitById(id).subscribe(data => {
      console.log(data);
      this.habit = data;
    });
  }

  goToMyHabits(): void {
    this.router.navigate([`/profile/${this.userID}/allhabits`]);
  }

}
