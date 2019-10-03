import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../service/user/user.service';
import {UserInitialsModel} from '../../../model/user/user-initials.model';
import {JwtService} from '../../../service/jwt.service';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.css']
})
export class UserSettingComponent implements OnInit {

  private email = '';
  private userInitialsModel = new UserInitialsModel();
  // private newUserInitialsModel = new UserInitialsModel();
  private isFirstNameEditing = false;
  private isLastNameEditing = false;
  private isSomethingEdited = false;

  constructor(private userService: UserService, private jwtService: JwtService, private dialogRef: MatDialogRef<UserSettingComponent>) {
    this.email = jwtService.getEmailFromAccessToken();
    this.getUserInitials();
  }

  ngOnInit() {
  }

  private getUserInitials() {
    this.userService.getUserInitials().subscribe((userInitialsModel: UserInitialsModel) => {
      this.userInitialsModel = userInitialsModel;
    });
  }

  private updateUserInitials() {
    this.userService.updateUserInitials(this.userInitialsModel).subscribe(
      () => {
        this.jwtService.setFirstName(this.userInitialsModel.firstName);
        this.dialogRef.close();
        window.location.href = '/';
      },
      error => {

      });
  }

  private somethingEdited() {
    console.log('something edited');
    this.isLastNameEditing = false;
    this.isFirstNameEditing = false;
    this.isSomethingEdited = true;
  }

  private firstNameEditing() {
    if (!this.isLastNameEditing) {
      this.isFirstNameEditing = true;
    }
  }
  private lastNameEditing() {
    if (!this.isFirstNameEditing) {
      this.isLastNameEditing = true;
    }
  }
}
