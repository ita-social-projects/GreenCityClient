import { Component, EventEmitter, OnInit, OnDestroy, Output, Injector } from '@angular/core';
import { AbstractControl, FormGroup, FormControl, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PopUpViewService } from '@auth-service/pop-up/pop-up-view.service';

@Component({
  selector: 'app-restore-password',
  templateUrl: './restore-password.component.html',
  styleUrls: ['./restore-password.component.scss']
})
export class RestorePasswordComponent implements OnInit, OnDestroy {
  public restorePasswordForm: FormGroup;
  public emailField: AbstractControl;
  private popUpViewSerVice: PopUpViewService;
  public currentLanguage: string;
  public emailFieldValue: string;
  public isUbs: boolean;
  private destroy: Subject<boolean> = new Subject<boolean>();
  @Output() public pageName = new EventEmitter();
  public dialog: MatDialog;
  private localStorageService: LocalStorageService;

  constructor(private matDialogRef: MatDialogRef<RestorePasswordComponent>, private injector: Injector) {
    this.dialog = injector.get(MatDialog);
    this.popUpViewSerVice = injector.get(PopUpViewService);
    this.localStorageService = injector.get(LocalStorageService);
  }

  ngOnInit() {
    this.localStorageService.ubsRegBehaviourSubject.pipe(takeUntil(this.destroy)).subscribe((value) => (this.isUbs = value));
    this.restorePasswordForm = new FormGroup({
      email: new FormControl(null)
    });
    this.emailField = this.restorePasswordForm.get('email');
    this.popUpViewSerVice.closePopUpSubject.pipe(takeUntil(this.destroy)).subscribe((value) => {
      if (value === 'close') {
        this.onCloseRestoreWindow();
      }
    });
    this.checkIfUserId();
  }

  private checkIfUserId(): void {
    this.localStorageService.userIdBehaviourSubject.pipe(takeUntil(this.destroy)).subscribe((userId) => {
      if (userId) {
        this.matDialogRef.close();
      }
    });
  }

  private onCloseRestoreWindow(): void {
    this.matDialogRef.close();
  }

  public onBackToSignIn(page): void {
    this.pageName.emit(page);
  }

  sendEmail(): void {
    this.popUpViewSerVice.sendEmail(this.emailField.value);
  }

  public signInWithGoogle(): void {
    this.popUpViewSerVice.signInWithGoogle();
  }

  ngOnDestroy() {
    this.destroy.next(true);
    this.destroy.complete();
  }
}
