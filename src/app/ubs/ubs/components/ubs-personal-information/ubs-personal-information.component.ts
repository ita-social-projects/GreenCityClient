import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBaseComponent } from '@shared/components/form-base/form-base.component';
import { debounceTime, distinctUntilChanged, filter, take, takeUntil } from 'rxjs/operators';
import { Subject, combineLatest } from 'rxjs';
import { OrderService } from '../../services/order.service';
import { Address, CourierLocations, PersonalData } from '../../models/ubs.interface';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PhoneNumberValidator } from 'src/app/shared/phone-validator/phone.validator';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { UBSAddAddressPopUpComponent } from 'src/app/shared/ubs-add-address-pop-up/ubs-add-address-pop-up.component';
import { Masks, Patterns } from 'src/assets/patterns/patterns';
import { Locations } from 'src/assets/locations/locations';
import { Store, select } from '@ngrx/store';
import {
  DeleteAddress,
  GetPersonalData,
  GetAddresses,
  SetPersonalData,
  UpdateAddress,
  GetExistingOrderInfo,
  SetAddressId
} from 'src/app/store/actions/order.actions';
import {
  existingOrderInfoSelector,
  locationIdSelector,
  personalDataSelector,
  addressesSelector
} from 'src/app/store/selectors/order.selectors';
import { Language } from 'src/app/main/i18n/Language';
import { IAddressExportDetails, IUserOrderInfo } from 'src/app/ubs/ubs-user/ubs-user-orders-list/models/UserOrder.interface';
import { WarningPopUpComponent } from '@shared/components';

@Component({
  selector: 'app-ubs-personal-information',
  templateUrl: './ubs-personal-information.component.html',
  styleUrls: ['./ubs-personal-information.component.scss']
})
export class UBSPersonalInformationComponent extends FormBaseComponent implements OnInit, OnDestroy {
  personalData: PersonalData;
  personalDataForm: FormGroup;
  locations: CourierLocations;
  addresses: Address[] = [];
  currentLocation = {};
  currentLocationId: number;
  currentLanguage: string;
  cities: string[];
  existingOrderId: number;
  existingOrderInfo: IUserOrderInfo;

  maxAddressLength = 4;
  locationIdForKyiv = 1;
  locationIdForKyivRegion = 2;
  namePattern = Patterns.NamePattern;
  emailPattern = Patterns.ubsMailPattern;
  phoneMask = Masks.phoneMask;
  private $destroy: Subject<void> = new Subject<void>();
  private nameValidators = [Validators.required, Validators.pattern(this.namePattern), Validators.maxLength(30)];
  popupConfig = {
    hasBackdrop: true,
    closeOnNavigation: true,
    disableClose: true,
    panelClass: 'custom-ubs-style',
    data: {
      popupTitle: 'confirmation.title',
      popupSubtitle: 'confirmation.subTitle',
      popupConfirm: 'confirmation.cancel',
      popupCancel: 'confirmation.dismiss',
      isUBS: true
    }
  };

  get firstName() {
    return this.personalDataForm.controls.firstName;
  }

  get lastName() {
    return this.personalDataForm.controls.lastName;
  }

  get phoneNumber() {
    return this.personalDataForm.controls.phoneNumber;
  }

  get email() {
    return this.personalDataForm.controls.email;
  }

  get senderFirstName() {
    return this.personalDataForm.controls.senderFirstName;
  }

  get senderLastName() {
    return this.personalDataForm.controls.senderLastName;
  }

  get senderPhoneNumber() {
    return this.personalDataForm.controls.senderPhoneNumber;
  }

  get senderEmail() {
    return this.personalDataForm.controls.senderEmail;
  }

  get isAnotherClient() {
    return this.personalDataForm.controls.isAnotherClient;
  }

  get address() {
    return this.personalDataForm?.controls.address;
  }

  get addressComment() {
    return this.personalDataForm?.controls.addressComment;
  }

  getAddress(addressId: number) {
    return this.addresses.find((address) => address.id === addressId) ?? null;
  }

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public orderService: OrderService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private localService: LocalStorageService,
    private listOflocations: Locations,
    private store: Store
  ) {
    super(router, dialog, orderService, localService);
  }

  ngOnInit(): void {
    this.cities = this.listOflocations.getCity(Language.EN).map((city) => city.cityName);
    this.route.queryParams.pipe(take(1)).subscribe((params) => {
      this.existingOrderId = params.existingOrderId;
      if (this.existingOrderId >= 0) {
        this.store.dispatch(GetExistingOrderInfo({ orderId: this.existingOrderId }));
        this.initListenersForExistingOrder();
      } else {
        this.initListenersForNewOrder();
      }
    });
    this.store.dispatch(GetAddresses());
    this.store.dispatch(GetPersonalData());
    this.localService.languageBehaviourSubject.pipe(takeUntil(this.$destroy)).subscribe((lang: string) => {
      this.currentLanguage = lang;
    });
  }

  initListenersForExistingOrder(): void {
    combineLatest([
      this.store.pipe(select(existingOrderInfoSelector), filter(Boolean), take(1)),
      this.store.pipe(select(personalDataSelector), filter(Boolean), take(1))
    ]).subscribe(([orderInfo, personalData]: [IUserOrderInfo, PersonalData]) => {
      this.personalData = personalData;
      this.existingOrderInfo = orderInfo;
      this.initForm();
      this.initPersonalDataForExistingOrder();
      if (this.addresses) {
        this.initLocationForExistingOrder();
      }
    });

    combineLatest([
      this.store.pipe(
        select(locationIdSelector),
        filter((value) => value !== null)
      ),
      this.store.pipe(select(addressesSelector), filter(Boolean))
    ])
      .pipe(takeUntil(this.$destroy))
      .subscribe(([locationId, addresses]: [number, Address[]]) => {
        this.addresses = addresses;
        this.currentLocationId = locationId;
        if (this.personalDataForm) {
          this.initLocationForExistingOrder();
        }
      });
  }

  initPersonalDataForExistingOrder(): void {
    const sender = this.existingOrderInfo.sender;
    const isSameSender =
      this.personalData.firstName === sender.senderName &&
      this.personalData.lastName === sender.senderSurname &&
      this.personalData.phoneNumber === sender.senderPhone &&
      this.personalData.email === sender.senderEmail;

    if (isSameSender) {
      return;
    }
    this.isAnotherClient.setValue(true);
    this.senderFirstName.setValue(sender.senderName);
    this.senderLastName.setValue(sender.senderSurname);
    this.senderEmail.setValue(sender.senderEmail);
    this.senderPhoneNumber.setValue(sender.senderPhone);
  }

  initListenersForNewOrder(): void {
    this.store.pipe(select(personalDataSelector), filter(Boolean), take(1)).subscribe((personalData: PersonalData) => {
      this.personalData = personalData;
      this.initForm();
      this.initLocations();
    });

    combineLatest([
      this.store.pipe(
        select(locationIdSelector),
        filter((value) => value !== null)
      ),
      this.store.pipe(select(addressesSelector), filter(Boolean))
    ])
      .pipe(takeUntil(this.$destroy))
      .subscribe(([locationId, addresses]: [number, Address[]]) => {
        this.addresses = addresses;
        this.currentLocationId = locationId;
        if (this.personalDataForm) {
          this.initLocations();
        }
      });
  }

  initForm(): void {
    this.personalDataForm = this.fb.group({
      firstName: [this.personalData.firstName ?? '', this.nameValidators],
      lastName: [this.personalData.lastName ?? '', this.nameValidators],
      email: [this.personalData.email ?? '', [Validators.required, Validators.maxLength(40), Validators.pattern(this.emailPattern)]],
      phoneNumber: [this.personalData.phoneNumber ?? '', [Validators.required, Validators.minLength(12), PhoneNumberValidator('UA')]],
      senderFirstName: [this.personalData.firstName ?? '', this.nameValidators],
      senderLastName: [this.personalData.lastName ?? '', this.nameValidators],
      senderEmail: [this.personalData.email ?? '', [Validators.maxLength(40), Validators.pattern(this.emailPattern)]],
      senderPhoneNumber: [this.personalData.phoneNumber ?? '', [Validators.required, Validators.minLength(12), PhoneNumberValidator('UA')]],
      isAnotherClient: [this.personalData.isAnotherClient ?? false],
      address: ['', Validators.required],
      addressComment: ['', Validators.maxLength(255)]
    });

    this.address.valueChanges.subscribe(() => {
      this.address.value ? this.addressComment.enable() : this.addressComment.disable();
      this.store.dispatch(SetAddressId({ addressId: this.address.value.id }));
    });

    this.isAnotherClient.valueChanges.pipe(distinctUntilChanged(), filter(Boolean), takeUntil(this.$destroy)).subscribe((val) => {
      this.senderFirstName.setValue('');
      this.senderLastName.setValue('');
      this.senderPhoneNumber.setValue('');
      this.senderEmail.setValue('');
    });

    this.personalDataForm.valueChanges.pipe(debounceTime(400), takeUntil(this.$destroy)).subscribe(() => {
      if (!this.isAnotherClient.value) {
        this.senderFirstName.setValue(this.firstName.value, { emitEvent: false });
        this.senderLastName.setValue(this.lastName.value, { emitEvent: false });
        this.senderPhoneNumber.setValue(this.phoneNumber.value, { emitEvent: false });
        this.senderEmail.setValue(this.email.value, { emitEvent: false });
      }
      this.dispatchPersonalData();
    });
  }

  dispatchPersonalData(): void {
    const personalData: PersonalData = {
      ...this.personalData,
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      email: this.email.value,
      phoneNumber: this.phoneNumber.value,
      isAnotherClient: this.isAnotherClient.value,
      senderEmail: this.senderEmail.value,
      senderFirstName: this.senderFirstName.value,
      senderLastName: this.senderLastName.value,
      senderPhoneNumber: this.senderPhoneNumber.value,
      addressComment: this.addressComment.value,
      city: this.address.value?.city ?? '',
      cityEn: this.address.value?.cityEn ?? '',
      district: this.address.value?.district ?? '',
      districtEn: this.address.value?.districtEn ?? '',
      street: this.address.value?.street ?? '',
      streetEn: this.address.value?.streetEn ?? '',
      region: this.address.value?.region ?? '',
      regionEn: this.address.value?.regionEn ?? '',
      houseCorpus: this.address.value?.houseCorpus ?? '',
      entranceNumber: this.address.value?.entranceNumber ?? '',
      houseNumber: this.address.value?.houseNumber ?? ''
    };

    this.store.dispatch(SetPersonalData({ personalData }));
  }

  initLocations(): void {
    let address = this.checkIfAddressCanBeSelected(this.address.value.id);

    if (!address) {
      const actualAddressId = this.addresses.find((address) => address.actual)?.id;
      address = this.checkIfAddressCanBeSelected(actualAddressId);
    }

    if (address) {
      this.checkAddress(address);
      return;
    }

    this.findAvailableAddress();
  }

  checkIfAddressCanBeSelected(id: number): Address | null {
    if (!id) {
      return null;
    }

    const address = this.getAddress(id);
    return address && !this.isAddressDisabledForCurrentLocation(address) ? address : null;
  }

  findAvailableAddress(): void {
    for (const address of this.addresses) {
      if (!this.isAddressDisabledForCurrentLocation(address)) {
        this.checkAddress(address);
        return;
      }
    }
    this.address.patchValue('');
  }

  initLocationForExistingOrder(): void {
    const addressDetails: IAddressExportDetails = this.existingOrderInfo.address;
    const address = this.addresses.find(
      (address) =>
        address.cityEn === addressDetails.addressCityEng &&
        address.regionEn === addressDetails.addressRegionEng &&
        address.streetEn === addressDetails.addressStreetEng &&
        address.districtEn === addressDetails.addressDistinctEng &&
        address.houseNumber === addressDetails.houseNumber
    );

    address && !this.isAddressDisabledForCurrentLocation(address) ? this.checkAddress(address) : this.initLocations();
  }

  checkAddress(address): void {
    this.address.patchValue(address);
    this.addressComment.patchValue(address.addressComment ?? '');
  }

  isAddressDisabledForCurrentLocation(address: Address): boolean {
    const isCity = this.currentLocationId === this.locationIdForKyiv;

    if (address) {
      const isAddressInCity = this.cities.includes(address.cityEn);
      return isCity ? !isAddressInCity : isAddressInCity;
    }

    return false;
  }

  deleteAddress(address: Address): void {
    this.store.dispatch(DeleteAddress({ address }));
  }

  changeAddressComment(): void {
    if (this.addressComment.value !== this.address.value.addressComment) {
      this.store.dispatch(UpdateAddress({ address: { ...this.address.value, addressComment: this.addressComment.value } }));
    }
  }

  addNewAddress(): void {
    this.openDialog(false);
  }

  editAddress(addressId: number): void {
    this.openDialog(true, addressId);
  }

  openDialog(isEdit: boolean, addressId?: number): void {
    const currentAddress = this.addresses.find((address) => address.id === addressId);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'address-matDialog-styles';
    dialogConfig.data = {
      edit: isEdit,
      currentLocation: this.currentLocation
    };
    if (isEdit) {
      dialogConfig.data.address = currentAddress;
    } else {
      dialogConfig.data.address = {};
    }
    const dialogRef = this.dialog.open(UBSAddAddressPopUpComponent, dialogConfig);
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.$destroy))
      .subscribe((res) => {});
  }

  getFormValues(): boolean {
    return true;
  }

  onCancel(): void {
    const matDialogRef = this.dialog.open(WarningPopUpComponent, this.popupConfig);

    matDialogRef
      .afterClosed()
      .pipe(take(1), filter(Boolean))
      .subscribe(() => {
        this.router.navigate(['ubs']);
      });
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
