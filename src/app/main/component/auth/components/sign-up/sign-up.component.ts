import { Component, EventEmitter, OnInit, OnDestroy, Output, Injector } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { PopUpViewService } from '@auth-service/pop-up/pop-up-view.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit, OnDestroy {
  public signUpForm: FormGroup;
  public emailControl: AbstractControl;
  public firstNameControl: AbstractControl;
  public passwordControl: AbstractControl;
  public passwordControlConfirm: AbstractControl;
  public currentLanguage: string;
  private destroy: Subject<boolean> = new Subject<boolean>();
  public isUbs: boolean;
  @Output() private pageName = new EventEmitter();
  private dialog: MatDialog;
  private formBuilder: FormBuilder;
  private popupViewService: PopUpViewService;
  private localeStorageService: LocalStorageService;

  constructor(private matDialogRef: MatDialogRef<SignUpComponent>, private injector: Injector) {
    this.dialog = injector.get(MatDialog);
    this.formBuilder = injector.get(FormBuilder);
    this.popupViewService = injector.get(PopUpViewService);
    this.localeStorageService = injector.get(LocalStorageService);
  }

  ngOnInit() {
    this.localeStorageService.ubsRegBehaviourSubject.pipe(takeUntil(this.destroy)).subscribe((value) => (this.isUbs = value));
    this.currentLanguage = this.localeStorageService.getCurrentLanguage();
    this.onFormInit();
    this.getFormFields();
    this.popupViewService.closePopUpSubject.pipe(takeUntil(this.destroy)).subscribe((value) => {
      if (value === 'close') {
        this.closeSignUpWindow();
      }
    });
  }

  public onSubmit(): void {
    this.popupViewService.signUp(this.emailControl.value, this.firstNameControl.value, this.passwordControl.value);
  }

  private getFormFields(): void {
    this.emailControl = this.signUpForm.get('email');
    this.firstNameControl = this.signUpForm.get('firstName');
    this.passwordControl = this.signUpForm.get('password');
    this.passwordControlConfirm = this.signUpForm.get('repeatPassword');
  }

  public signUpWithGoogle(): void {
    this.popupViewService.signInWithGoogle();
  }

  public openSignInWindow(): void {
    this.pageName.emit('sign-in');
  }

  private onFormInit(): void {
    this.signUpForm = this.formBuilder.group({
      email: ['', []],
      firstName: ['', []],
      password: ['', []],
      repeatPassword: ['', []]
    });
  }

  private closeSignUpWindow(): void {
    this.matDialogRef.close();
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.complete();
  }
}
