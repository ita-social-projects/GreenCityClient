import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarClassName } from '@global-errors/error-constants';

@Component({
  selector: 'app-mat-snack-bar',
  templateUrl: './mat-snack-bar.component.html',
  styleUrls: ['./mat-snack-bar.component.scss'],
  providers: [TranslateService]
})
export class MatSnackBarComponent {
  public message: string;
  snackType = {
    error: { classname: SnackbarClassName.error, key: 'snack-bar.error.default' },
    createEvent: { classname: SnackbarClassName.success, key: 'snack-bar.success.create-news' },
    attention: { classname: SnackbarClassName.attention, key: 'snack-bar.attention.default' },
    success: { classname: SnackbarClassName.success, key: 'snack-bar.success.default' },
    exitConfirmRestorePassword: { classname: SnackbarClassName.attention, key: 'snack-bar.attention.exit-confirm-restore-password' },
    successRestorePassword: { classname: SnackbarClassName.success, key: 'snack-bar.success.restore-password' },
    successRestorePasswordUbs: { classname: SnackbarClassName.successUbs, key: 'snack-bar.success.restore-password' },
    successConfirmPassword: { classname: SnackbarClassName.success, key: 'snack-bar.success.confirm-restore-password' },
    successConfirmPasswordUbs: { classname: SnackbarClassName.successUbs, key: 'snack-bar.success.confirm-restore-password' },
    signUp: { classname: SnackbarClassName.success, key: 'snack-bar.success.sign-up' },
    signUpUbs: { classname: SnackbarClassName.successUbs, key: 'snack-bar.success.sign-up' },
    successConfirmEmail: { classname: SnackbarClassName.success, key: 'snack-bar.success.confirm-email' },
    successConfirmSaveOrder: { classname: SnackbarClassName.successUbs, key: 'snack-bar.saved-order' },
    successConfirmUpdateOrder: { classname: SnackbarClassName.successUbs, key: 'snack-bar.update-order' },
    successUpdateUbsData: { classname: SnackbarClassName.successUbs, key: 'snack-bar.save-employee-permissons' },
    cafeNotificationsExists: { classname: SnackbarClassName.error, key: 'update-cafe.notifications.exists' },
    cafeNotificationsCloseTime: { classname: SnackbarClassName.error, key: 'update-cafe.notifications.closeTime' },
    cafeNotificationsBreakTime: { classname: SnackbarClassName.error, key: 'update-cafe.notifications.breakTime' },
    cafeNotificationsPhotoUpload: { classname: SnackbarClassName.error, key: 'update-cafe.notifications.photoUpload' },
    habitDeleted: { classname: SnackbarClassName.error, key: 'user.habit.all-habits.habit-was-deleted' },
    habitAdded: { classname: SnackbarClassName.success, key: 'user.habit.all-habits.new-habit-added' },

    habitDidNotGiveUp: { classname: SnackbarClassName.success, key: 'user.habit.all-habits.habit-did-not-give-up' },
    habitUpdated: { classname: SnackbarClassName.success, key: 'user.habit.all-habits.new-habit-updated' },
    habitAcquired: { classname: SnackbarClassName.success, key: 'user.habit.all-habits.habit-acquired' },
    errorMessage: { classname: SnackbarClassName.error },
    sendNewLetter: { classname: SnackbarClassName.error, key: 'snack-bar.error.restore-password-again' },
    changesSaved: { classname: SnackbarClassName.success, key: 'user.edit-profile.profile-changes-saved' },
    existAddress: { classname: SnackbarClassName.error, key: 'snack-bar.error.exist-address' },
    addedAddress: { classname: SnackbarClassName.success, key: 'snack-bar.success.added-address' },
    userUnauthorised: { classname: SnackbarClassName.error, key: 'snack-bar.error.unauthorised-user' },
    lessPoints: { classname: SnackbarClassName.error, key: 'snack-bar.error.not-enough-points' },
    CartValidation: { classname: SnackbarClassName.error, key: 'snack-bar.error.cartificate-not-valid' },
    addedEvent: { classname: SnackbarClassName.success, key: 'create-event.created-event' },
    updatedEvent: { classname: SnackbarClassName.success, key: 'create-event.updated-event' },
    savedChangesToUserProfile: { classname: SnackbarClassName.success, key: 'snack-bar.success.saved-changes' },
    updatedNotification: { classname: SnackbarClassName.success, key: 'snack-bar.success.update-notification' },
    joinedEvent: { classname: SnackbarClassName.success, key: 'snack-bar.success.joined-event' },
    errorJoinEvent: { classname: SnackbarClassName.error, key: 'snack-bar.success.error-joined-event' },
    tooLongInput: { classname: SnackbarClassName.error, key: 'user.habit.too-long-input' },
    ratedEvent: { classname: SnackbarClassName.success, key: 'snack-bar.success.rating-send' },
    addFriend: { classname: SnackbarClassName.success, key: 'snack-bar.success.add-friend' },
    jointEventRequest: { classname: SnackbarClassName.success, key: 'snack-bar.success.joint-event-request' }
  };

  constructor(public snackBar: MatSnackBar, private translate: TranslateService) {}

  public openSnackBar(type: string, additionalValue?: string) {
    const isInclude = type.includes('400') ? this.getSnackBarMessage('error') : this.getSnackBarMessage('errorMessage', type);
    if (additionalValue) {
      return this.snackType[type] ? this.getSnackBarMessage(type, additionalValue) : isInclude;
    }
    return this.snackType[type] ? this.getSnackBarMessage(type) : isInclude;
  }

  public getSnackBarMessage(type: string, additionalValue?: string): void {
    const className = this.snackType[type].classname;
    const key = this.snackType[type].key || type;
    const addValue = additionalValue ? { orderId: additionalValue } : {};
    this.translate.get(key, addValue).subscribe((translation) => {
      this.message = translation;
      this.snackBar.open(this.message, 'close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: [className]
      });
    });
  }
}
