import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HabitItemModel, ServerHabitItemPageModel } from '@global-user/models/habit-item.model';
import { Subscription } from 'rxjs';
import { AllHabitsService } from '../all-habits/services/all-habits.service';
import { AddNewHabit2Service } from './services/add-new-habit2.service';

@Component({
  selector: 'app-add-new-habit2',
  templateUrl: './add-new-habit2.component.html',
  styleUrls: ['./add-new-habit2.component.scss']
})
export class AddNewHabit2Component implements OnInit {
  public habit: ServerHabitItemPageModel;
  public habitID: number;
  public userID: number;
  public galleryView = true;
  public subscription: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private addHabitService: AddNewHabit2Service) { 
                this.route.params.subscribe(params => {
                  this.habitID = +params.habitId;
                  this.userID = +params.id;
                })
              }

  ngOnInit() {
    this.getHabitById(this.habitID);
  }

  getHabitById(id: number): any {
    this.addHabitService.getHabitById(id).subscribe(data =>{
      console.log(data);
      this.habit = data;
    });
  }

  goToMyHabits(): void {
    this.router.navigate([`/profile/${this.userID}/allhabits`]);
  }

}
