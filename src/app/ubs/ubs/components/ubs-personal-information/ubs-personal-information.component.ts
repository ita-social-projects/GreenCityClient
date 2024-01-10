import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBaseComponent } from '@shared/components/form-base/form-base.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UBSOrderFormService } from '../../services/ubs-order-form.service';
import { OrderService } from '../../services/order.service';
import { Address, Bag, CourierLocations, OrderBag, OrderDetails, PersonalData } from '../../models/ubs.interface';
import { Order } from '../../models/ubs.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PhoneNumberValidator } from 'src/app/shared/phone-validator/phone.validator';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { UBSAddAddressPopUpComponent } from 'src/app/shared/ubs-add-address-pop-up/ubs-add-address-pop-up.component';
import { Masks, Patterns } from 'src/assets/patterns/patterns';
import { Locations } from 'src/assets/locations/locations';
import { GoogleScript } from 'src/assets/google-script/google-script';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { Store } from '@ngrx/store';
import { AddPersonalData } from 'src/app/store/actions/order.actions';

@Component({
  selector: 'app-ubs-personal-information',
  templateUrl: './ubs-personal-information.component.html',
  styleUrls: ['./ubs-personal-information.component.scss']
})
export class UBSPersonalInformationComponent extends FormBaseComponent implements OnInit, OnDestroy, OnChanges {
  addressId: number;
  orderDetails: OrderDetails;
  personalData: PersonalData;
  personalDataForm: FormGroup;
  shouldBePaid = true;
  order: Order;
  addresses: Address[] = [];
  maxAddressLength = 4;
  namePattern = Patterns.NamePattern;
  emailPattern = Patterns.ubsMailPattern;
  phoneMask = Masks.phoneMask;
  firstOrder = true;
  isThisExistingOrder: boolean;
  anotherClient = false;
  currentLocation = {};
  citiesForLocationId = [];
  currentLocationId: number;
  locations: CourierLocations;
  currentLanguage: string;
  checkedAddress: Address;
  private destroy: Subject<boolean> = new Subject<boolean>();
  private personalDataFormValidators: ValidatorFn[] = [
    Validators.required,
    Validators.pattern(this.namePattern),
    Validators.minLength(1),
    Validators.maxLength(30)
  ];
  locationIdForKyiv = 1;
  locationIdForKyivRegion = 2;
  isNotChoosedLocation: boolean;
  private anotherClientValidators: ValidatorFn[] = [Validators.maxLength(30), Validators.pattern(this.namePattern)];
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

  @Input() completed;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public orderService: OrderService,
    private shareFormService: UBSOrderFormService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private localService: LocalStorageService,
    private listOflocations: Locations,
    private googleScript: GoogleScript,
    private langService: LanguageService,
    private store: Store
  ) {
    super(router, dialog, orderService, localService);
    this.initForm();
  }

  ngOnInit() {
    console.log('second init');

    this.orderService.locationSubject.pipe(takeUntil(this.destroy)).subscribe(() => {
      if (this.localService.getLocationId()) {
        this.currentLocationId = this.localService.getLocationId();
        this.setDisabledCityForLocation();
      }
    });
    this.localService.languageBehaviourSubject.pipe(takeUntil(this.destroy)).subscribe((lang: string) => {
      this.currentLanguage = lang;
      this.googleScript.load(lang);
    });

    if (this.localService.getIsAnotherClient()) {
      this.anotherClient = this.localService.getIsAnotherClient();
    }
    this.takeUserData();
    if (this.localService.getAddressId()) {
      this.addressId = this.localService.getAddressId();
    }
    if (this.localService.getCurrentLocationId()) {
      this.currentLocationId = this.localService.getCurrentLocationId();
      this.locations = this.localService.getLocations();
      this.currentLocation = this.locations.locationsDtosList[0].nameEn;
    }
    this.orderService.locationSub.subscribe((data) => {
      this.currentLocation = data;
      this.locations = this.localService.getLocations();
    });
    this.orderService.currentAddress.subscribe((data: Address) => {
      this.personalDataForm.controls.address.setValue(data);
      this.personalDataForm.controls.addressComment.setValue(data.addressComment);
    });
    this.route.queryParams.subscribe((params) => {
      const key = 'isThisExistingOrder';
      this.isThisExistingOrder = !!params[key];
    });
  }

  public getLangCityValue(uaValue: string, enValue: string): string {
    return this.langService.getLangValue(uaValue, enValue) as string;
  }

  setDisabledCityForLocation(): void {
    const isCityAccess = this.currentLocationId === this.locationIdForKyiv;
    const [currentRegionUk, currentRegionEn] = this.getLangValue(this.locations?.regionDto.nameUk, this.locations?.regionDto.nameEn);
    const citiesForLocationId = this.listOflocations.getCity(this.currentLanguage).map((city) => city.cityName);

    this.addresses = this.addresses.map((address) => {
      const newAddress = { ...address };
      const cityName = this.getLangCityValue(newAddress.city, newAddress.cityEn);
      const isCity = citiesForLocationId.includes(cityName);

      const [regionNameUk, regionNameEn] = this.getLangValue(newAddress.region, newAddress.regionEn);
      const isRegion = currentRegionUk?.includes(regionNameUk) || currentRegionEn?.includes(regionNameEn);

      if (isCityAccess || this.currentLocationId === this.locationIdForKyivRegion) {
        newAddress.display = isCityAccess ? isCity : !isCity && isRegion;
      } else {
        newAddress.display = isRegion;
      }
      return newAddress;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.shareFormService.changePersonalData();
    if (changes.completed?.currentValue) {
      this.submit();
    }
  }

  getFormValues(): boolean {
    return true;
  }

  findAllAddresses(isCheck: boolean) {
    this.orderService
      .findAllAddresses()
      .pipe(takeUntil(this.destroy))
      .subscribe((list) => {
        this.addresses = list.addressList;
        console.log(this.addresses);

        this.localService.setAddresses(this.addresses);
        this.personalDataForm.patchValue({
          address: this.addresses
        });
        if (this.addresses.length) {
          this.setDisabledCityForLocation();
        }
        const actualAddress = this.addresses.find((address) => address.actual === true);
        this.checkAddress(actualAddress?.id);
      });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.unsubscribe();
  }

  initForm() {
    this.personalDataForm = this.fb.group({
      firstName: ['', this.personalDataFormValidators],
      lastName: ['', this.personalDataFormValidators],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(40), Validators.pattern(this.emailPattern)]],
      phoneNumber: ['+38 0', [Validators.required, Validators.minLength(12), PhoneNumberValidator('UA')]],
      anotherClientFirstName: ['', this.anotherClientValidators],
      anotherClientLastName: ['', this.anotherClientValidators],
      anotherClientEmail: ['', [Validators.email, Validators.maxLength(40), Validators.pattern(this.emailPattern)]],
      anotherClientPhoneNumber: ['+38 0'],
      address: ['', Validators.required],
      addressComment: ['', Validators.maxLength(255)]
    });
  }

  public takeUserData() {
    this.orderService
      .getPersonalData()
      .pipe(takeUntil(this.destroy))
      .subscribe((personalData: PersonalData) => {
        this.personalData = this.shareFormService.personalData;
        this.setFormData();
        this.findAllAddresses(true);
      });
  }

  checkAddress(addressId) {
    console.log(addressId);

    if (addressId) {
      this.addresses.forEach((address) => {
        if (address.id === addressId) {
          this.orderService.setCurrentAddress(address);
          this.checkedAddress = address;
          this.addresses.forEach((address) => (address.actual = false));
          address.actual = true;
        }
      });
      this.isNotChoosedLocation = this.checkedAddress.display === false;
      this.localService.setAddressId(addressId);
      this.localService.setAddresses(this.addresses);
      this.orderService.setActualAddress(addressId).pipe(takeUntil(this.destroy)).subscribe();
      this.changeAddressInPersonalData();
    }
  }

  isOneAdress() {
    if (this.addresses.length === 1) {
      this.addresses[0].actual = true;
    }
  }

  changeAddressInPersonalData(): void {
    this.currentLocationId = this.localService.getCurrentLocationId();
    this.isOneAdress();
    const actualAddress = this.addresses.find((address) => address.actual);
    const activeAddress = this.checkedAddress ?? actualAddress;
    if (this.personalData && activeAddress) {
      const {
        city,
        cityEn,
        district,
        districtEn,
        region,
        regionEn,
        street,
        streetEn,
        houseNumber,
        houseCorpus,
        entranceNumber,
        coordinates
      } = activeAddress;
      this.personalData.city = city;
      this.personalData.cityEn = cityEn;
      this.personalData.district = district;
      this.personalData.districtEn = districtEn;
      this.personalData.region = region;
      this.personalData.regionEn = regionEn;
      this.personalData.street = street;
      this.personalData.streetEn = streetEn;
      this.personalData.houseNumber = houseNumber;
      this.personalData.houseCorpus = houseCorpus;
      this.personalData.entranceNumber = entranceNumber;
      this.personalData.latitude = coordinates.latitude;
      this.personalData.longitude = coordinates.longitude;
    }
    this.shareFormService.saveDataOnLocalStorage();
    this.localService.setLocationId(this.currentLocationId);
  }

  changeAnotherClientInPersonalData() {
    this.currentLocationId = this.localService.getCurrentLocationId();
    this.personalData.senderFirstName = this.personalDataForm.get('anotherClientFirstName').value;
    this.personalData.senderLastName = this.personalDataForm.get('anotherClientLastName').value;
    this.personalData.senderEmail = this.personalDataForm.get('anotherClientEmail').value;
    this.personalData.senderPhoneNumber = this.personalDataForm.get('anotherClientPhoneNumber').value;
    this.shareFormService.saveDataOnLocalStorage();
    this.localService.setLocationId(this.currentLocationId);
  }

  setFormData(): void {
    this.personalDataForm.patchValue({
      firstName: this.personalData.firstName,
      lastName: this.personalData.lastName,
      email: this.personalData.email,
      phoneNumber: this.personalData.phoneNumber,
      anotherClientFirstName: this.personalData.senderFirstName,
      anotherClientLastName: this.personalData.senderLastName,
      anotherClientEmail: this.personalData.senderEmail,
      anotherClientPhoneNumber: this.personalData.senderPhoneNumber,
      addressComment: this.addresses.length > 0 ? this.personalData.addressComment : ''
    });
    this.personalDataForm.markAllAsTouched();
  }

  togglClient(): void {
    const anotherClientFirstName = this.getControl('anotherClientFirstName');
    const anotherClientLastName = this.getControl('anotherClientLastName');
    const anotherClientPhoneNumber = this.getControl('anotherClientPhoneNumber');
    const anotherClientEmail = this.getControl('anotherClientEmail');
    this.anotherClient = !this.anotherClient;
    if (this.anotherClient) {
      anotherClientFirstName.markAsUntouched();
      anotherClientLastName.markAsUntouched();
      anotherClientPhoneNumber.markAsUntouched();
      anotherClientEmail.markAsUntouched();
      anotherClientFirstName.setValidators(this.personalDataFormValidators);
      anotherClientLastName.setValidators(this.personalDataFormValidators);
      anotherClientPhoneNumber.setValidators([Validators.required, Validators.minLength(12), PhoneNumberValidator('UA')]);
      anotherClientPhoneNumber.setValue('+380');
      this.localService.setIsAnotherClient(true);
    } else {
      anotherClientFirstName.setValue('');
      anotherClientFirstName.clearValidators();
      anotherClientLastName.setValue('');
      anotherClientLastName.clearValidators();
      anotherClientPhoneNumber.setValue('');
      anotherClientPhoneNumber.clearValidators();
      anotherClientEmail.setValue('');
      this.localService.removeIsAnotherClient();
    }
    anotherClientFirstName.updateValueAndValidity();
    anotherClientLastName.updateValueAndValidity();
    anotherClientPhoneNumber.updateValueAndValidity();
    this.changeAnotherClientInPersonalData();
  }

  editAddress(addressId: number) {
    this.openDialog(true, addressId);
  }

  activeAddressId() {
    this.isOneAdress();
    const activeAddress = this.addresses.find((address) => address.actual);
    this.addressId = this.checkedAddress?.id ?? activeAddress?.id;
  }

  deleteAddress(address: Address) {
    this.orderService
      .deleteAddress(address)
      .pipe(takeUntil(this.destroy))
      .subscribe((list: { addressList: Address[] }) => {
        this.addresses = list.addressList;
        if (this.addresses[0]) {
          this.setDisabledCityForLocation();
          this.checkAddress(this.addresses[0].id);
        } else {
          this.personalDataForm.patchValue({
            address: ''
          });
        }
      });
  }

  addNewAddress() {
    this.openDialog(false);
    this.personalDataForm.patchValue({
      address: this.addresses
    });
  }

  getControl(control: string) {
    return this.personalDataForm.get(control);
  }

  public getLangValue(uaName: string, enName: string): [string, string] {
    return [this.langService.getLangValue(uaName, enName) as string, this.langService.getLangValue(enName, uaName) as string];
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
      .pipe(takeUntil(this.destroy))
      .subscribe((res) => {
        if (res) {
          this.findAllAddresses(false);
        }
      });
  }

  submit(): void {
    this.firstOrder = false;
    this.activeAddressId();
    this.changeAddressInPersonalData();

    this.orderDetails = this.shareFormService.orderDetails;
    let orderBags: OrderBag[] = [];
    this.orderDetails.bags.forEach((bagItem: Bag, index: number) => {
      if (bagItem.quantity !== null) {
        const bag: OrderBag = { amount: bagItem.quantity, id: bagItem.id };
        orderBags.push(bag);
      }
    });
    orderBags = orderBags.filter((bag) => bag.amount && bag.amount !== 0);
    const isAnotherClient = !!this.personalDataForm.get('anotherClientFirstName').value;
    this.personalData.firstName = this.personalDataForm.get('firstName').value;
    this.personalData.lastName = this.personalDataForm.get('lastName').value;
    this.personalData.email = this.personalDataForm.get('email').value;
    this.personalData.phoneNumber = this.personalDataForm.get('phoneNumber').value;
    this.personalData.addressComment = this.personalDataForm.get('addressComment').value;
    this.personalData.senderFirstName = isAnotherClient
      ? this.personalDataForm.get('anotherClientFirstName').value
      : this.personalData.firstName;
    this.personalData.senderLastName = isAnotherClient
      ? this.personalDataForm.get('anotherClientLastName').value
      : this.personalData.lastName;
    this.personalData.senderEmail = isAnotherClient ? this.personalDataForm.get('anotherClientEmail').value : this.personalData.email;
    this.personalData.senderPhoneNumber = isAnotherClient
      ? this.personalDataForm.get('anotherClientPhoneNumber').value
      : this.personalData.phoneNumber;
    this.order = new Order(
      this.shareFormService.orderDetails.additionalOrders[0] !== '' ? this.shareFormService.orderDetails.additionalOrders : null,
      this.addressId,
      orderBags,
      this.shareFormService.orderDetails.certificates,
      this.currentLocationId,
      this.shareFormService.orderDetails.orderComment,
      this.personalData,
      this.shareFormService.orderDetails.pointsToUse,
      this.shouldBePaid
    );
    this.order.addressId = this.localService.getAddressId();
    this.orderService.setOrder(this.order);
  }

  changeAddressComment() {
    this.isOneAdress();
    this.addresses.forEach((address) => {
      if (address.actual) {
        address.addressComment = this.personalDataForm.controls.addressComment.value;
        this.orderService.updateAdress(address).subscribe(() => {
          this.orderService.setCurrentAddress(address);
          this.findAllAddresses(false);
        });
      }
    });
  }

  savePersonalInfoToState(): void {
    if (!this.isThisExistingOrder) {
      this.store.dispatch(AddPersonalData({ personalData: { ...this.personalData } }));
    }
  }
}
