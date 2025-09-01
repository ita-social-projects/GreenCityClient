import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserOwnAuthService } from 'src/app/shared/services/auth/user-own-auth.service';
import { JwtService } from 'src/app/shared/services/jwt/jwt.service';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { LanguageService } from 'src/app/shared/i18n/language.service';
import { SignInIcons } from 'src/app/shared/image-paths/sign-in-icons';
import { UBSAddAddressPopUpComponent } from '@ubs/shared/components/ubs-add-address-pop-up/ubs-add-address-pop-up.component';
import { ResetEmployeePermissions } from 'src/app/store/actions/employee.actions';
import { ResetFriends } from 'src/app/store/actions/friends.actions';
import { CreateAddress, GetAddresses, UpdateAddress } from 'src/app/store/actions/order.actions';
import { addressesSelector } from 'src/app/store/selectors/order.selectors';
import { DeletingProfileReasonPopUpComponent } from 'src/app/ubs/ubs-admin/components/shared/components/deleting-profile-reason-pop-up/deleting-profile-reason-pop-up.component';
import { Address, UserProfile } from 'src/app/ubs/ubs-admin/models/ubs-admin.interface';
import { ClientProfileService } from 'src/app/ubs/ubs-user/services/client-profile.service';
import { OrderService } from 'src/app/ubs/ubs/services/order.service';
import { Masks, Patterns, phonePrefix } from 'src/assets/patterns/patterns';
import { ConfirmationDialogComponent } from '../../../ubs-admin/components/shared/components/confirmation-dialog/confirmation-dialog.component';
import { UbsProfileChangePasswordPopUpComponent } from './ubs-profile-change-password-pop-up/ubs-profile-change-password-pop-up.component';
import { PhoneNumberValidator } from '@ubs/shared/validators/phone-validator/phone.validator';
import { MatSnackBarService } from '@global-service/mat-snack-bar/mat-snack-bar.service';
import { AddressData } from '@ubs/ubs/models/ubs.interface';

@Component({
  selector: 'app-ubs-user-profile-page',
  templateUrl: './ubs-user-profile-page.component.html',
  styleUrls: ['./ubs-user-profile-page.component.scss']
})
export class UbsUserProfilePageComponent implements OnInit, OnDestroy {
  private jwtService: JwtService = inject(JwtService);
  private router: Router = inject(Router);
  private userOwnAuthService: UserOwnAuthService = inject(UserOwnAuthService);
  private localeStorageService: LocalStorageService = inject(LocalStorageService);

  userForm: FormGroup;
  userProfile: UserProfile;
  userEmail: string;
  telegramBotURL: string;
  errorMessages = [];
  maxAddressLength = 4;
  isEditing = false;
  isFetching = false;
  alternativeEmailDisplay = false;
  googleIcon = SignInIcons.picGoogle;
  phoneMask: string = Masks.phoneMask;
  phonePrefix: string = phonePrefix;
  resetFieldImg = './assets/img/ubs-tariff/bigClose.svg';
  tempAddedAddressHolder: AddressData[] = [];
  tempRemovedAddressHolder: Address[] = [];
  savedUserAddresses: Address[];

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
  dataTelegramSubscription = {
    title: 'ubs-client-profile.telegram-subscription-title',
    text: 'ubs-client-profile.telegram-subscription-message',
    confirm: 'ubs-client-profile.telegram-start-bot',
    cancel: 'ubs-client-profile.btn.cancel'
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
    private readonly dialog: MatDialog,
    private readonly clientProfileService: ClientProfileService,
    private readonly snackBar: MatSnackBarService,
    private readonly orderService: OrderService,
    private readonly languageService: LanguageService,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    this.userEmail = this.jwtService.getEmailFromAccessToken();
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
          this.savedUserAddresses = [...res.addressDto];
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
        Validators.pattern(Patterns.NamePattern),
        Validators.maxLength(30)
      ]),
      recipientEmail: new FormControl(this.userProfile?.recipientEmail, [Validators.required, Validators.pattern(Patterns.ubsMailPattern)]),
      alternateEmail: new FormControl(this.userProfile?.alternateEmail, [Validators.pattern(Patterns.ubsMailPattern)]),
      recipientPhone: new FormControl(`${this.userProfile?.recipientPhone ? this.userProfile?.recipientPhone : ''}`, [
        PhoneNumberValidator('UA')
      ]),
      telegramIsNotify: new FormControl(this.userProfile.telegramIsNotify)
    });

    this.isFetching = false;
  }

  deleteAddress(address: Address | AddressData) {
    if (this.tempAddedAddressHolder.find((addr) => addr.placeId === address.placeId)) {
      this.tempAddedAddressHolder = this.tempAddedAddressHolder.filter((addr) => addr.placeId !== address.placeId);
    } else {
      this.tempRemovedAddressHolder.push(address as Address);
    }
    this.userProfile.addressDto = this.userProfile.addressDto.filter((addr) => addr.placeId !== address.placeId);
    this.userInit();
    this.userForm.markAsDirty();
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
    this.orderService
      .setActualAddress(addressId)
      .pipe(take(1))
      .subscribe(() => {
        this.userForm.markAsDirty();
      });
  }

  focusOnFirst(): void {
    document.getElementById('recipientName').focus();
  }

  onCancel(): void {
    this.userProfile.addressDto = [...this.savedUserAddresses];
    this.tempAddedAddressHolder.length = 0;
    this.tempRemovedAddressHolder.length = 0;
    this.userInit();
    this.isEditing = false;
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.isFetching = true;
      this.isEditing = false;
      const submitData: UserProfile = {
        addressDto: [],
        recipientEmail: this.userForm.value.recipientEmail,
        alternateEmail: this.userForm.value.alternateEmail,
        recipientName: this.userForm.value.recipientName,
        recipientPhone: this.userForm.value.recipientPhone,
        recipientSurname: this.userForm.value.recipientSurname,
        telegramIsNotify: this.userProfile.telegramIsNotify,
        hasPassword: this.userProfile.hasPassword
      };

      if (!submitData.alternateEmail?.length) {
        delete submitData.alternateEmail;
      }

      this.userProfile.addressDto.forEach((address, i) => {
        const formAddress = this.userForm.value.address[i];
        const originalAddress = this.userProfile.addressDto[i];

        const isUpdated = Object.keys(formAddress).some((key) => formAddress[key] !== originalAddress[key]);

        if (isUpdated && originalAddress.id) {
          const updatedAddress = {
            ...formAddress,
            id: originalAddress.id,
            actual: originalAddress.actual
          };
          if (!updatedAddress.houseCorpus) {
            delete updatedAddress.houseCorpus;
          }
          if (!updatedAddress.entranceNumber) {
            delete updatedAddress.entranceNumber;
          }
          delete updatedAddress.searchAddress;
          delete updatedAddress.isHouseSelected;

          submitData.addressDto.push(updatedAddress);
          this.store.dispatch(UpdateAddress({ address: updatedAddress }));
        } else if (isUpdated) {
          const index = this.tempAddedAddressHolder.findIndex((tempAddress) => tempAddress.placeId === formAddress.placeId);

          if (index !== -1) {
            this.tempAddedAddressHolder[index] = formAddress;
          }
        }
      });

      this.saveAddedAddresses();
      this.deleteChosenAddresses();

      this.clientProfileService
        .postDataClientProfile(submitData)
        .pipe(take(1))
        .subscribe({
          next: (res: UserProfile) => {
            this.isFetching = false;
            this.userProfile = res;
            if (res.addressDto) {
              this.savedUserAddresses = [...res.addressDto];
            }
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

  saveAddedAddresses() {
    if (this.tempAddedAddressHolder.length) {
      this.tempAddedAddressHolder.forEach((addedAddress) => {
        this.store.dispatch(CreateAddress({ address: addedAddress, hideSuccessPopup: true }));
      });
      this.tempAddedAddressHolder.length = 0;
    }
  }

  deleteChosenAddresses() {
    if (this.tempRemovedAddressHolder.length) {
      this.tempRemovedAddressHolder.forEach((removedAddress: Address) => {
        this.orderService
          .deleteAddress(removedAddress)
          .pipe(take(1))
          .subscribe({
            error: () => {
              this.snackBar.openSnackBar('error');
            }
          });
      });
      this.tempRemovedAddressHolder.length = 0;
    }
  }

  goToTelegramUrl() {
    (window as any).open(this.telegramBotURL, '_blank');
  }

  openDeleteProfileDialog(): void {
    const matDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: this.dataDeleteProfile,
      hasBackdrop: true
    });

    matDialogRef
      .afterClosed()
      .pipe(take(1), filter(Boolean))
      .subscribe(() => this.openDeleteProfileReasonPopUp());
  }

  openDeleteProfileReasonPopUp(): void {
    const matDialogRef = this.dialog.open(DeletingProfileReasonPopUpComponent, {
      hasBackdrop: true
    });

    matDialogRef
      .afterClosed()
      .pipe(take(1), filter(Boolean))
      .subscribe((res) => {
        this.clientProfileService
          .deactivateProfile(this.userEmail, res.reason)
          .pipe(take(1))
          .subscribe(() => {
            this.signOut();
          });
      });
  }

  signOut(): void {
    this.jwtService.userRole$.next('');

    this.router.navigateByUrl('/').then((isRedirected: boolean) => {
      this.userOwnAuthService.isLoginUserSubject.next(false);
      this.localeStorageService.clear();
    });
    this.store.dispatch(ResetEmployeePermissions());
    this.store.dispatch(ResetFriends());
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
      address: {},
      addressesFromProfile: this.tempAddedAddressHolder
    };

    const dialogRef = this.dialog.open(UBSAddAddressPopUpComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.value) {
        this.tempAddedAddressHolder.push(result.value);
        this.userProfile.addressDto.push(result.value);
        this.userInit();
        this.userForm.markAsDirty();
      }
    });
  }

  formatedPhoneNumber(num: string): string | void {
    const match = RegExp(/^\+380(\d{2})(\d{3})(\d{2})(\d{2})$/).exec(num);
    if (match) {
      return `+380 (${match[1]}) ${match[2]} ${match[3]} ${match[4]}`;
    }
  }

  onPhoneFocus(): void {
    if (!this.recipientPhone.value) {
      this.recipientPhone.setValue(this.phonePrefix);
    }
  }

  onPhoneBlur(): void {
    if (this.recipientPhone.value === this.phonePrefix) {
      this.recipientPhone.setValue('');
      this.recipientPhone.markAsUntouched();
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

  onSwitchChanged(): void {
    const currentValue = this.userProfile.telegramIsNotify;
    const newValue = !currentValue;

    if (newValue) {
      const matDialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: this.dataTelegramSubscription,
        hasBackdrop: true
      });
      matDialogRef
        .afterClosed()
        .pipe(take(1))
        .subscribe((confirmed) => {
          if (confirmed) {
            this.userProfile.telegramIsNotify = true;
            this.userForm.markAsDirty();
            this.userForm.get('telegramIsNotify')?.setValue(true);
            this.goToTelegramUrl();
          } else {
            this.userForm.get('telegramIsNotify')?.setValue(false);
          }
        });
    } else {
      this.userProfile.telegramIsNotify = false;
      this.userForm.markAsDirty();
      this.userForm.get('telegramIsNotify')?.setValue(false);
    }
  }

  isTelegramNotifyChecked(): boolean {
    return !!this.userForm?.get('telegramIsNotify')?.value;
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.complete();
  }
}
