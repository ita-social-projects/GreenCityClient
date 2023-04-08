import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UbsAdminEmployeeService } from '../../../services/ubs-admin-employee.service';
import {
  Employees,
  Page,
  EmployeePositions,
  InitialData,
  TariffForEmployee,
  EmployeeDataToSend
} from '../../../models/ubs-admin.interface';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/state/app.state';
import { AddEmployee, UpdateEmployee } from 'src/app/store/actions/employee.actions';
import { skip, takeUntil } from 'rxjs/operators';
import { ShowImgsPopUpComponent } from '../../../../../shared/show-imgs-pop-up/show-imgs-pop-up.component';
import { Subject } from 'rxjs';
import { Masks, Patterns } from 'src/assets/patterns/patterns';
import { TariffSelectorComponent } from './tariff-selector/tariff-selector.component';
import { PhoneNumberValidator } from 'src/app/shared/phone-validator/phone.validator';

@Component({
  selector: 'app-ubs-admin-employee-edit-form',
  templateUrl: './ubs-admin-employee-edit-form.component.html',
  styleUrls: ['./ubs-admin-employee-edit-form.component.scss']
})
export class UbsAdminEmployeeEditFormComponent implements OnInit, OnDestroy {
  icons = {
    accordionArrowDown: './assets/img/icon/arrows/arrow-accordion-down.svg',
    cross: 'assets/img/ubs/cross.svg'
  };
  roles: EmployeePositions[];
  employeeForm: FormGroup;
  employeePositions: EmployeePositions[];
  tariffs: TariffForEmployee[] = [];
  employeeDataToSend: EmployeeDataToSend;
  phoneMask = Masks.phoneMask;
  private maxImageSize = 10485760;
  private destroyed$: Subject<void> = new Subject<void>();
  public isWarning = false;
  public isUploading = false;
  public isInitialDataChanged = false;
  public isInitialImageChanged = false;
  public isInitialPositionsChanged = false;
  public isInitialTariffsChanged = false;
  public editMode: boolean;
  initialData: InitialData;
  imageURL: string;
  imageName = 'Your Avatar';
  selectedFile;
  defaultPhotoURL = 'https://csb10032000a548f571.blob.core.windows.net/allfiles/90370622-3311-4ff1-9462-20cc98a64d1ddefault_image.jpg';

  private mappers = {
    tariffs: (tariffData) =>
      tariffData.map((tariff) => ({
        id: tariff.id,
        courier: { en: tariff.courier.nameEn, ua: tariff.courier.nameUk },
        region: { en: tariff.region.nameEn, ua: tariff.region.nameUk },
        locations: tariff.locationsDtos.map((loc) => ({ en: loc.nameEn, ua: loc.nameUk }))
      }))
  };

  constructor(
    private employeeService: UbsAdminEmployeeService,
    private store: Store<IAppState>,
    public dialogRef: MatDialogRef<UbsAdminEmployeeEditFormComponent>,
    public fb: FormBuilder,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: Page
  ) {
    this.employeeForm = this.fb.group({
      firstName: [this.data?.firstName ?? '', [Validators.required, Validators.pattern(Patterns.NamePattern), Validators.maxLength(30)]],
      lastName: [this.data?.lastName ?? '', [Validators.required, Validators.pattern(Patterns.NamePattern), Validators.maxLength(30)]],
      phoneNumber: [
        this.data?.phoneNumber ?? '',
        [Validators.required, Validators.pattern(Patterns.adminPhone), PhoneNumberValidator('UA')]
      ],
      email: [this.data?.email ?? '', [Validators.required, Validators.pattern(Patterns.ubsMailPattern)]]
    });
    this.employeePositions = this.data?.employeePositions ?? [];
    this.imageURL = this.data?.image;
    this.editMode = !!this.data;
    if (this.editMode) {
      this.editEmployee();
      this.initialData = {
        firstName: this.data.firstName,
        lastName: this.data.lastName,
        phoneNumber: this.data.phoneNumber.replace('+', ''),
        email: this.data?.email,
        imageURL: this.data?.image,
        employeePositionsIds: this.employeePositions.map((position) => position.id)
      };
      this.tariffs = this.mappers.tariffs(this.data?.tariffs) ?? [];
    }
  }

  ngOnInit() {
    this.employeeService.getAllPositions().subscribe(
      (roles) => {
        this.roles = roles;
      },
      (error) => console.error('Observer for role got an error: ' + error)
    );
    this.store
      .select((state: IAppState): Employees => state.employees.employees)
      .pipe(skip(1))
      .subscribe(() => {
        this.dialogRef.close();
      });
    this.store
      .select((state: IAppState): string | null => state.employees.error)
      .pipe(skip(1))
      .subscribe(() => {
        this.isUploading = false;
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  get isUpdatingEmployee() {
    return this.data && Object.keys(this.data).length !== 0;
  }

  get userHasDefaultPhoto() {
    return this.imageURL === this.defaultPhotoURL;
  }

  get firstName() {
    return this.employeeForm.get('firstName');
  }

  get lastName() {
    return this.employeeForm.get('lastName');
  }

  get phoneNumber() {
    return this.employeeForm.get('phoneNumber');
  }

  get email() {
    return this.employeeForm.get('email');
  }

  onCheckChangeRole(role) {
    if (this.doesIncludeRole(role)) {
      this.employeePositions = this.employeePositions.filter((position) => position.id !== role.id);
    } else {
      this.employeePositions = [...this.employeePositions, role];
    }
    if (this.editMode) {
      this.isInitialPositionsChanged = this.checkIsInitialPositionsChanged();
    }
  }

  doesIncludeRole(role) {
    return this.employeePositions.some((existingRole) => existingRole.id === role.id);
  }

  checkIsInitialPositionsChanged(): boolean {
    if (this.initialData.employeePositionsIds.length !== this.employeePositions.length) {
      return true;
    }
    return this.employeePositions.filter((position) => !this.initialData.employeePositionsIds.includes(position.id)).length > 0;
  }

  prepareEmployeeDataToSend(dto: string, image?: string): FormData {
    this.isUploading = true;
    this.employeeDataToSend = {
      employeeDto: {
        ...this.employeeForm.value,
        employeePositions: this.employeePositions
      },
      tariffId: this.tariffs.map((it) => it.id)
    };
    if (this.isUpdatingEmployee) {
      this.employeeDataToSend.employeeDto.id = this.data.id;
    }
    if (image) {
      this.employeeDataToSend.employeeDto.image = image;
    }
    const formData: FormData = new FormData();
    const stringifiedDataToSend = JSON.stringify(this.employeeDataToSend);
    formData.append(dto, stringifiedDataToSend);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    return formData;
  }

  editEmployee(): void {
    this.editMode = true;
    this.employeeForm.enable();
    this.employeeForm.markAsTouched();
    this.employeeForm.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe((values) => {
      this.isInitialDataChanged =
        this.initialData.firstName !== values.firstName ||
        this.initialData.lastName !== values.lastName ||
        this.initialData.phoneNumber !== values.phoneNumber.replace('+', '') ||
        this.initialData.email !== values.email;
    });
  }

  updateEmployee(): void {
    const image = this.selectedFile ? this.defaultPhotoURL : this.imageURL || this.defaultPhotoURL;
    const dataToSend = this.prepareEmployeeDataToSend('employeeWithTariffsIdDto', image);
    this.store.dispatch(UpdateEmployee({ data: dataToSend, employee: this.employeeDataToSend }));
  }

  createEmployee(): void {
    const image = this.selectedFile ? this.defaultPhotoURL : this.imageURL || this.defaultPhotoURL;
    const dataToSend = this.prepareEmployeeDataToSend('employeeWithTariffsIdDto', image);
    this.store.dispatch(AddEmployee({ data: dataToSend, employee: this.employeeDataToSend }));
  }

  treatFileInput(event: Event): void {
    event.preventDefault();

    const imageFile = (event.target as HTMLInputElement).files[0];
    this.transferFile(imageFile);
  }

  public filesDropped(files: File): void {
    const imageFile = files[0].file;
    this.transferFile(imageFile);
  }

  private transferFile(imageFile: File): void {
    this.isWarning = this.showWarning(imageFile);

    if (!this.isWarning) {
      const reader: FileReader = new FileReader();
      this.selectedFile = imageFile;
      this.imageName = this.selectedFile.name;

      reader.readAsDataURL(this.selectedFile);
      reader.onload = () => {
        this.imageURL = reader.result as string;
        if (this.editMode) {
          this.isInitialImageChanged = true;
        }
      };
    }
  }

  private showWarning(file: File): boolean {
    return file.size > this.maxImageSize || (file.type !== 'image/jpeg' && file.type !== 'image/png');
  }

  removeImage() {
    this.imageURL = null;
    this.imageName = null;
    this.selectedFile = null;
    if (this.editMode) {
      this.isInitialImageChanged = this.initialData.imageURL !== this.defaultPhotoURL;
    }
  }

  openImg(): void {
    this.dialog.open(ShowImgsPopUpComponent, {
      hasBackdrop: true,
      panelClass: 'custom-img-pop-up',
      data: {
        imgIndex: 0,
        images: [{ src: this.imageURL }]
      }
    });
  }

  onAddTariff(): void {
    this.dialog
      .open(TariffSelectorComponent, {
        hasBackdrop: true
      })
      .afterClosed()
      .subscribe((updates) => {
        if (!updates) {
          return;
        }
        const newTariffs = this.tariffs;
        const presentTariffsIds = newTariffs.map(({ id }) => id);
        updates.forEach((tariff) => {
          if (presentTariffsIds.includes(tariff.id)) {
            return;
          }
          newTariffs.push(tariff);
        });
        this.tariffs = newTariffs;
        this.isInitialTariffsChanged = true;
      });
  }

  onRemoveTariff(tariffToRemove): void {
    this.tariffs = this.tariffs.filter((tariff) => tariff !== tariffToRemove);
    this.isInitialTariffsChanged = true;
  }
}
