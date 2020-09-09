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
  public windowSize: number;

  constructor(private allHabitsService: AllHabitsService) { }

  ngOnInit() {
    this.getAllHabits();
    this.onResize();
  }

  onDisplayModeChange(mode): void {
    this.galleryView = mode;
  }

  getAllHabits(): void {
    this.subscription = this.allHabitsService.getAllHabits()
      .subscribe((data: object[]) => {
        this.habitsMockList = data;
      }, error => {
        this.habitsMockList = error;
      });
  }

  public onResize(): void {
    this.windowSize = window.innerWidth;
    this.galleryView = (this.windowSize >= 576) ? this.galleryView : true;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
