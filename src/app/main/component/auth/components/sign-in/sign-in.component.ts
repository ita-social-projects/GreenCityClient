import { FormGroup, AbstractControl, FormBuilder } from '@angular/forms';
import { Component, EventEmitter, OnInit, OnDestroy, Output, Injector } from '@angular/core';
import { Subject } from 'rxjs';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { takeUntil } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PopUpViewService } from '@auth-service/pop-up/pop-up-view.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit, OnDestroy {
  public emailField: AbstractControl;
  public passwordField: AbstractControl;
  public loadingAnim: boolean;
  public signInForm: FormGroup;
  private destroy: Subject<boolean> = new Subject<boolean>();
  public isUbs: boolean;
  @Output() private pageName = new EventEmitter();
  public dialog: MatDialog;
  private localeStorageService: LocalStorageService;
  private popUpViewService: PopUpViewService;
  private fb: FormBuilder;

  constructor(private matDialogRef: MatDialogRef<SignInComponent>, private injector: Injector) {
    this.popUpViewService = injector.get(PopUpViewService);
    this.dialog = injector.get(MatDialog);
    this.localeStorageService = injector.get(LocalStorageService);
    this.fb = injector.get(FormBuilder);
  }

  ngOnInit() {
    this.localeStorageService.ubsRegBehaviourSubject.pipe(takeUntil(this.destroy)).subscribe((value) => (this.isUbs = value));
    this.checkIfUserId();
    this.signInForm = this.fb.group({
      email: [''],
      password: ['']
    });
    this.emailField = this.signInForm.get('email');
    this.passwordField = this.signInForm.get('password');
  }

  public signIn(): void {
    this.popUpViewService.signIn(this.emailField.value, this.passwordField.value);
  }

  public signInWithGoogle(): void {
    this.popUpViewService.signInWithGoogle();
  }

  public onOpenModalWindow(windowPath: string): void {
    this.pageName.emit(windowPath);
  }

  private checkIfUserId(): void {
    this.localeStorageService.userIdBehaviourSubject.pipe(takeUntil(this.destroy)).subscribe((userId) => {
      if (userId) {
        this.matDialogRef.close();
      }
    });
  }

  ngOnDestroy() {
    this.destroy.next(true);
    this.destroy.complete();
  }
}
