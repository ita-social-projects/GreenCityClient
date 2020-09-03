import { Subscription } from 'rxjs';
import { AllHabitsService } from './services/all-habits.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-all-habits',
  templateUrl: './all-habits.component.html',
  styleUrls: ['./all-habits.component.scss']
})
export class AllHabitsComponent implements OnInit, OnDestroy {

  public habitsMockList: object[];
  public galleryView = true;
  private subscription: Subscription;

  constructor(private allHabitsService: AllHabitsService) { }

  ngOnInit() {
    this.getAllHabits();
  }

  onDisplayModeChange(mode): void {
    this.galleryView = mode;
  }

  getAllHabits(): void {
    this.subscription = this.allHabitsService.getAllHabits()
      .subscribe((data: object[]) => this.habitsMockList = data);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
