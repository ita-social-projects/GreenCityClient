import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SignInIcons } from 'src/app/main/image-pathes/sign-in-icons';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { Address, UserProfile } from 'src/app/ubs/ubs-admin/models/ubs-admin.interface';
import { ClientProfileService } from 'src/app/ubs/ubs-user/services/client-profile.service';
import { UBSAddAddressPopUpComponent } from 'src/app/shared/ubs-add-address-pop-up/ubs-add-address-pop-up.component';
import { UbsProfileChangePasswordPopUpComponent } from './ubs-profile-change-password-pop-up/ubs-profile-change-password-pop-up.component';
import { ConfirmationDialogComponent } from '../../ubs-admin/components/shared/components/confirmation-dialog/confirmation-dialog.component';
import { Masks, Patterns } from 'src/assets/patterns/patterns';
import { PhoneNumberValidator } from 'src/app/shared/phone-validator/phone.validator';
import { take } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { OrderService } from 'src/app/ubs/ubs/services/order.service';
import { NotificationPlatform } from '../../ubs/notification-platform.enum';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { select, Store } from '@ngrx/store';
import { GetAddresses } from 'src/app/store/actions/order.actions';
import { addressesSelector } from 'src/app/store/selectors/order.selectors';

@Component({
  selector: 'app-ubs-user-profile-page',
  templateUrl: './ubs-user-profile-page.component.html',
  styleUrls: ['./ubs-user-profile-page.component.scss']
})
export class UbsUserProfilePageComponent implements OnInit, OnDestroy {
  userForm: FormGroup;
  userProfile: UserProfile;
  telegramBotURL: string;
  viberBotURL: string;
  errorMessages = [];
  maxAddressLength = 4;
  isEditing = false;
  isFetching = false;
  alternativeEmailDisplay = false;
  googleIcon = SignInIcons.picGoogle;
  phoneMask = Masks.phoneMask;
  resetFieldImg = './assets/img/ubs-tariff/bigClose.svg';

  private destroy: Subject<boolean> = new Subject<boolean>();

  dataDeleteAddress = {
    title: 'ubs-client-profile.delete-address',
    confirm: 'ubs-client-profile.payment.yes',
    cancel: 'ubs-client-profile.payment.no'
  };
  dataDeleteProfile = {
    title: 'ubs-client-profile.delete-title',
    text: 'ubs-client-profile.delete-message',
    confirm: 'ubs-client-profile.btn.delete-profile-save',
    cancel: 'ubs-client-profile.btn.delete-profile-cancel'
  };

  @ViewChild('#regionInput', { static: true }) regionInputRef: ElementRef<HTMLInputElement>;

  get recipientName() {
    return this.userForm.get('recipientName');
  }

  get recipientSurname() {
    return this.userForm.get('recipientSurname');
  }

  get alternateEmail() {
    return this.userForm.get('alternateEmail');
  }

  get recipientPhone() {
    return this.userForm.get('recipientPhone');
  }

  constructor(
    private dialog: MatDialog,
    private clientProfileService: ClientProfileService,
    private snackBar: MatSnackBarComponent,
    private orderService: OrderService,
    private languageService: LanguageService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.getUserData();

    this.store.dispatch(GetAddresses());

    this.store.pipe(select(addressesSelector)).subscribe((addresses) => {
      this.getUserData();
    });
  }

  getUserData(): void {
    this.isFetching = true;
    this.clientProfileService
      .getDataClientProfile()
      .pipe(take(1))
      .subscribe({
        next: (res: UserProfile) => {
          this.userProfile = res;
          this.userInit();
          this.setUrlToBot();
          this.isFetching = false;
        },
        error: () => {
          this.isFetching = false;
          this.snackBar.openSnackBar('error');
        }
      });
  }

  setUrlToBot(): void {
    this.telegramBotURL = this.userProfile.botList[0]?.link;
    this.viberBotURL = this.userProfile.botList[1]?.link;
  }

  userInit(): void {
    const addressArray = new FormArray([]);

    this.userProfile.addressDto.forEach((addressDTO) => {
      addressArray.push(new FormControl(addressDTO, []));
    });

    this.userForm = new FormGroup({
      address: addressArray,
      recipientName: new FormControl(this.userProfile?.recipientName, [
        Validators.required,
        Validators.pattern(Patterns.NamePattern),
        Validators.maxLength(30)
      ]),
      recipientSurname: new FormControl(this.userProfile?.recipientSurname, [
        Validators.required,
        Validators.pattern(Patterns.NamePattern),
        Validators.maxLength(30)
      ]),
      recipientEmail: new FormControl(this.userProfile?.recipientEmail, [Validators.required, Validators.pattern(Patterns.ubsMailPattern)]),
      alternativeEmail: new FormControl(this.userProfile?.alternateEmail, [Validators.pattern(Patterns.ubsMailPattern)]),
      recipientPhone: new FormControl(`${this.userProfile?.recipientPhone}`, [
        Validators.required,
        Validators.minLength(12),
        PhoneNumberValidator('UA')
      ]),
      telegramIsNotify: new FormControl(this.userProfile.telegramIsNotify),
      viberIsNotify: new FormControl(this.userProfile.viberIsNotify)
    });

    this.isFetching = false;
  }

  deleteAddress(address) {
    this.orderService
      .deleteAddress(address)
      .pipe(take(1))
      .subscribe((list: { addressList: Address[] }) => {
        this.userProfile.addressDto = list.addressList;
        this.getUserData();
      });
  }

  resetValue(): void {
    this.userForm.get('alternateEmail').setValue(null);
  }

  isSubmitBtnDisabled() {
    return this.userForm.invalid || this.userForm.pristine;
  }

  onEdit(): void {
    this.isEditing = true;
    this.isFetching = false;
    setTimeout(() => this.focusOnFirst());
  }

  setActualAddress(addressId): void {
    this.orderService.setActualAddress(addressId).pipe(take(1)).subscribe();
  }

  focusOnFirst(): void {
    document.getElementById('recipientName').focus();
  }

  onCancel(): void {
    this.userInit();
    this.isEditing = false;
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.isFetching = true;
      this.isEditing = false;
      const submitData = {
        addressDto: [],
        recipientEmail: this.userForm.value.recipientEmail,
        alternateEmail: this.userForm.value.alternateEmail,
        recipientName: this.userForm.value.recipientName,
        recipientPhone: this.userForm.value.recipientPhone,
        recipientSurname: this.userForm.value.recipientSurname,
        telegramIsNotify: this.userProfile.telegramIsNotify,
        viberIsNotify: this.userProfile.viberIsNotify,
        hasPassword: this.userProfile.hasPassword
      };

      if (!submitData.alternateEmail?.length) {
        delete submitData.alternateEmail;
      }
      this.userProfile.addressDto.forEach((address, i) => {
        const updatedAddres = {
          ...this.userForm.value.address[i],
          id: this.userProfile.addressDto[i].id,
          actual: this.userProfile.addressDto[i].actual,
          coordinates: this.userProfile.addressDto[i].coordinates
        };
        if (!updatedAddres.houseCorpus) {
          delete updatedAddres.houseCorpus;
        }
        if (!updatedAddres.entranceNumber) {
          delete updatedAddres.entranceNumber;
        }
        delete updatedAddres.searchAddress;
        delete updatedAddres.isHouseSelected;
        submitData.addressDto.push(updatedAddres);
      });

      this.clientProfileService
        .postDataClientProfile(submitData)
        .pipe(take(1))
        .subscribe({
          next: (res: UserProfile) => {
            this.isFetching = false;
            this.userProfile = res;
            this.userProfile.recipientEmail = this.userForm.value.recipientEmail;
            this.userProfile.alternateEmail = this.userForm.value.alternateEmail;
          },
          error: (err: Error) => {
            this.isFetching = false;
            this.snackBar.openSnackBar('error');
          }
        });
      this.alternativeEmailDisplay = false;
    } else {
      this.isEditing = true;
    }
    this.snackBar.openSnackBar('savedChangesToUserProfile');
  }

  goToTelegramUrl() {
    (window as any).open(this.telegramBotURL, '_blank');
  }

  goToViberUrl() {
    (window as any).open(this.viberBotURL, '_blank');
  }

  openDeleteProfileDialog(): void {
    this.dialog.open(ConfirmationDialogComponent, {
      data: this.dataDeleteProfile,
      hasBackdrop: true
    });
  }

  openDeleteAddressDialog(address): void {
    const matDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: this.dataDeleteAddress,
      hasBackdrop: true
    });

    matDialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((res) => {
        if (res) {
          this.deleteAddress(address);
        }
      });
  }

  openChangePasswordDialog(): void {
    this.dialog.open(UbsProfileChangePasswordPopUpComponent, {
      hasBackdrop: true,
      data: {
        hasPassword: this.userProfile.hasPassword
      }
    });
  }

  openAddAdressDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'address-matDialog-styles';
    dialogConfig.data = {
      edit: false,
      addFromProfile: true,
      address: {}
    };

    this.dialog.open(UBSAddAddressPopUpComponent, dialogConfig);
  }

  formatedPhoneNumber(num: string): string | void {
    const match = RegExp(/^(\d{2})(\d{3})(\d{2})(\d{2})$/).exec(num);
    if (match) {
      return ` +380 (${match[1]}) ${match[2]} ${match[3]} ${match[4]}`;
    }
  }

  toggleAlternativeEmail() {
    const control = new FormControl(this.userProfile?.alternateEmail, [
      Validators.pattern(Patterns.ubsMailPattern),
      Validators.minLength(3),
      Validators.maxLength(66),
      Validators.email
    ]);
    this.alternativeEmailDisplay = !this.alternativeEmailDisplay;

    this.alternativeEmailDisplay ? this.userForm.addControl('alternateEmail', control) : this.userForm.removeControl('alternateEmail');
  }

  onSwitchChanged(id: string): void {
    switch (id) {
      case NotificationPlatform.telegramNotification:
        this.userProfile.telegramIsNotify = !this.userProfile.telegramIsNotify;
        if (this.userProfile.telegramIsNotify) {
          this.goToTelegramUrl();
        }
        break;

      case NotificationPlatform.viberNotification:
        this.userProfile.viberIsNotify = !this.userProfile.viberIsNotify;
        if (this.userProfile.viberIsNotify) {
          this.goToViberUrl();
        }
        break;
    }
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.complete();
  }
}
