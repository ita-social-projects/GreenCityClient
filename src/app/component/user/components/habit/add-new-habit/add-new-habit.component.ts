import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerHabitItemPageModel } from '@global-user/models/habit-item.model';
import { AddNewHabitService } from './services/add-new-habit.service';

@Component({
  selector: 'app-add-new-habit',
  templateUrl: './add-new-habit.component.html',
  styleUrls: ['./add-new-habit.component.scss']
})
export class AddNewHabitComponent implements OnInit {
  public habit: ServerHabitItemPageModel;
  public habitId: number;
  public userId: string;
  public newDuration: number;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private addHabitService: AddNewHabitService) {  }

  ngOnInit() {
    this.getUserId();
    this.route.params.subscribe(params => {
      this.habitId = +params.habitId;
    });
    this.addHabitService.getHabitById(this.habitId).subscribe(data => {
      this.habit = data;
    });
  }

  public goToMyHabits(): void {
    this.router.navigate([`/profile/${this.userId}/allhabits`]);
  }

  private getUserId() {
    this.userId = localStorage.getItem('userId');
  }

  public getDuration(newDuration: number) {
    this.newDuration = newDuration;
  }

  public addHabit() {
   
  }

  

}
