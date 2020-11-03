import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HabitItemModel } from '@global-user/models/habit-item.model';
import { Subscription } from 'rxjs';
import { AllHabitsService } from '../all-habits/services/all-habits.service';
import { AddNewHabit2Service } from './services/add-new-habit2.service';

@Component({
  selector: 'app-add-new-habit2',
  templateUrl: './add-new-habit2.component.html',
  styleUrls: ['./add-new-habit2.component.scss']
})
export class AddNewHabit2Component implements OnInit {
  // public habit: any[];
  public habit: HabitItemModel;
  public habitID: number;
  public userID: number;
  public galleryView = true;
  public subscription: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private allHabitsService: AllHabitsService,
              private addHabitService: AddNewHabit2Service) { 
                this.route.params.subscribe(params => {
                  console.log(params);
                  console.log(params.habitId);
                  this.habitID = +params.habitId+502;
                  this.userID = +params.id;
                })
              }

  ngOnInit() {
    this.getHabitById(this.habitID);
  }

  // getAllHabits(): void {
  //   this.subscription = this.allHabitsService.getAllHabits()
  //     .subscribe((data) => {
  //       console.log(data);
        
  //       this.habit = data;
  //     }, error => {
  //       this.habit = error;
  //     });
  // }

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
