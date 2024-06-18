import { Component } from '@angular/core';
import { UserService } from '../../../../service/user/user.service';
import { UserUpdateModel } from '../../../../model/user/user-update.model';
import { JwtService } from '../../../../service/jwt/jwt.service';
import { LocalStorageService } from '../../../../service/localstorage/local-storage.service';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.scss']
})
export class UserSettingComponent {
  isSomethingEdited = false;
  email = '';
  userUpdateModel = new UserUpdateModel();
  isFirstNameEditing = false;
  isLastNameEditing = false;
  emailNotifications: string[] = [];

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private dialogRef: MatDialogRef<UserSettingComponent>,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {
    this.email = jwtService.getEmailFromAccessToken();
    this.getUser();
    this.setEmailNotifications();
  }

  private getUser() {
    this.userService.getUser().subscribe((userUpdateModel: UserUpdateModel) => {
      this.userUpdateModel = userUpdateModel;
    });
  }

  updateUser() {
    this.userService.updateUser(this.userUpdateModel).subscribe(() => {
      this.localStorageService.setFirstName(this.userUpdateModel.firstName);
      this.dialogRef.close();
      this.router.navigate(['/']);
    });
  }

  somethingEdited() {
    this.isLastNameEditing = false;
    this.isFirstNameEditing = false;
    this.isSomethingEdited = true;
  }

  firstNameEditing() {
    if (!this.isLastNameEditing) {
      this.isFirstNameEditing = true;
    }
  }

  lastNameEditing() {
    if (!this.isFirstNameEditing) {
      this.isLastNameEditing = true;
    }
  }

  private setEmailNotifications() {
    this.userService.getEmailNotificationsStatuses().subscribe((res) => {
      this.emailNotifications = [...res.filter((eNotification) => eNotification !== 'DISABLED').map((column) => column)];
    });
  }
}
