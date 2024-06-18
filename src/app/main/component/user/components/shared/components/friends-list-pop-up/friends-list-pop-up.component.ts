import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { FriendsHabitPopupModel } from '@global-user/components/habit/models/interfaces/habit-assign.interface';

@Component({
  selector: 'app-friends-list-pop-up',
  templateUrl: './friends-list-pop-up.component.html',
  styleUrls: ['./friends-list-pop-up.component.scss']
})
export class FriendsListPopUpComponent implements OnInit {
  closeButton = './assets/img/profile/icons/cancel.svg';
  friends: FriendsHabitPopupModel[] = [];

  constructor(
    public matDialogRef: MatDialogRef<FriendsListPopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private habitAsignService: HabitAssignService
  ) {}

  ngOnInit(): void {
    this.getFriendsHabitProgress();
  }

  getFriendsHabitProgress(): void {
    this.habitAsignService.getFriendsHabitProgress(this.data.habitId).subscribe((progress) => {
      this.data.friends.forEach((element) => {
        this.friends.push({
          ...element,
          habitProggress: progress.find((p) => p.userId === element.id)
        });
      });
    });
  }

  onClose() {
    this.matDialogRef.close();
  }
}
