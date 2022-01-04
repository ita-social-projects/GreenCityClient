import { Component, OnDestroy, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FileHandle } from '../../models/file-handle.model';
import { TranslateService } from '@ngx-translate/core';
import { iif, of, Subject } from 'rxjs';
import { switchMap, take, takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { ShowImgsPopUpComponent } from '../shared/components/show-imgs-pop-up/show-imgs-pop-up.component';
import { DialogPopUpComponent } from '../shared/components/dialog-pop-up/dialog-pop-up.component';

interface InitialData {
  violationLevel: string;
  violationDescription: string;
  initialImagesLength: number;
}

@Component({
  selector: 'app-add-violations',
  templateUrl: './add-violations.component.html',
  styleUrls: ['./add-violations.component.scss']
})
export class AddViolationsComponent implements OnInit, OnDestroy {
  maxNumberOfImgs = 6;
  images = [];
  files = [];
  isImageSizeError = false;
  isImageTypeError = false;
  isUploading = false;
  isDeleting = false;
  isLabel: boolean;
  dragAndDropLabel: string;
  addViolationForm: FormGroup;
  orderId;
  name: string;
  imgArray = [];
  imagesFromDBLength: number;
  imagesFromDB = [];
  deletedImages: string[] | null = [];
  initialData: InitialData;
  isInitialDataChanged = false;
  isInitialImageDataChanged = false;
  public date = new Date();
  unsubscribe: Subject<any> = new Subject();
  viewMode = false;
  editMode = false;
  isLoading = false;
  deleteDialogData = {
    popupTitle: 'add-violation-modal.delete-message',
    popupConfirm: 'employees.btn.yes',
    popupCancel: 'employees.btn.no'
  };
  clearChangesDialogData = {
    popupTitle: 'add-violation-modal.clear-changes',
    popupConfirm: 'employees.btn.yes',
    popupCancel: 'employees.btn.no'
  };

  constructor(
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data,
    private localeStorageService: LocalStorageService,
    private fb: FormBuilder,
    private orderService: OrderService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<AddViolationsComponent>
  ) {
    this.orderId = data.id;
    this.viewMode = data.viewMode;
  }

  @ViewChild('takeInput') InputVar: ElementRef;

  ngOnInit() {
    this.translate
      .get('add-violation-modal.drag-photo')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((value) => {
        this.dragAndDropLabel = value;
      });
    this.initForm();
    this.initImages();
    this.checkMode();
    this.localeStorageService.firstNameBehaviourSubject.pipe(takeUntil(this.unsubscribe)).subscribe((firstName) => {
      this.name = firstName;
    });
  }

  private initForm(): void {
    this.addViolationForm = this.fb.group({
      violationLevel: ['LOW', [Validators.required]],
      violationDescription: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(255)]]
    });
  }

  private checkMode() {
    if (this.viewMode) {
      this.isLoading = true;
      this.orderService
        .getViolationOfCurrentOrder(this.orderId)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((violation) => {
          this.addViolationForm.setValue({
            violationLevel: violation.violationLevel,
            violationDescription: violation.description
          });
          this.addViolationForm.controls.violationLevel.disable();
          this.addViolationForm.controls.violationDescription.disable();
          const images = violation.images.map((url) => ({ src: url, label: null, name: null }));
          this.images.splice(0, violation.images.length, ...images);
          if (violation.images.length < this.images.length) {
            this.images[violation.images.length].label = this.dragAndDropLabel;
          }
          this.imagesFromDBLength = violation.images.length;
          this.imagesFromDB = violation.images;
          this.date = violation.violationDate;
          this.isLoading = false;
          this.initialData = {
            violationLevel: violation.violationLevel,
            violationDescription: violation.description,
            initialImagesLength: violation.images.length
          };
        });
    }
  }

  prepareDataToSend(dto: string): FormData {
    const { violationLevel, violationDescription } = this.addViolationForm.value;
    const data = {
      orderID: this.orderId,
      violationDescription,
      violationLevel
    };
    if (this.editMode) {
      data['imagesToDelete'] = this.deletedImages.length ? this.deletedImages : null;
    }
    const formData: FormData = new FormData();
    const stringifiedDataToSend = JSON.stringify(data);
    formData.append(dto, stringifiedDataToSend);
    for (const images of this.imgArray) {
      formData.append(this.editMode ? 'multipartFiles' : 'files', images);
    }
    return formData;
  }

  send() {
    this.isUploading = true;
    const dataToSend = this.prepareDataToSend('add');
    of(true)
      .pipe(
        switchMap(() =>
          iif(
            () => this.editMode,
            this.orderService.updateViolationOfCurrentOrder(dataToSend),
            this.orderService.addViolationToCurrentOrder(dataToSend)
          )
        ),
        takeUntil(this.unsubscribe)
      )
      .subscribe(() => {
        this.dialogRef.close(this.editMode || 1);
      });
  }

  filesDropped(files: FileHandle[]): void {
    this.isImageSizeError = false;
    this.isImageTypeError = false;
    this.checkFileExtension(files);
    const imageFile = files[0].file;
    this.transferFile(imageFile);
  }

  loadFile(event): void {
    const imageFile = (event.target as HTMLInputElement).files[0];
    this.InputVar.nativeElement.value = '';
    this.transferFile(imageFile);
  }

  private transferFile(imageFile: File): void {
    if (!this.isImageTypeError) {
      const reader: FileReader = new FileReader();
      this.imgArray.push(imageFile);
      reader.readAsDataURL(imageFile);
      reader.onload = () => {
        this.assignImage(reader.result, imageFile.name);
      };
      if (this.editMode) {
        this.isInitialImageDataChanged = true;
      }
    }
  }

  checkFileExtension(files: FileHandle[]): void {
    let i = 0;
    for (const img of this.images) {
      if (!img.src && files[i]) {
        if (files[i].file.size >= 10485760) {
          this.isImageSizeError = true;
          i++;
          continue;
        }

        if (!(files[i].file.type === 'image/jpeg' || files[i].file.type === 'image/png')) {
          this.isImageTypeError = true;
          i++;
          continue;
        }
        i++;
      }
    }
    this.assignLabel();
  }

  assignImage(result: any, name: string): void {
    this.isImageSizeError = false;
    this.isImageTypeError = false;
    for (let i = 0; i < this.images.length; i++) {
      this.images[i].label = null;
      if (!this.images[i].src) {
        this.images[i].src = result;
        if (this.images[i + 1]) {
          this.images[i + 1].label = this.dragAndDropLabel;
        } else {
          this.isLabel = false;
        }
        this.images[i].name = name;
        break;
      }
    }
  }

  openImg(index: number): void {
    this.dialog.open(ShowImgsPopUpComponent, {
      hasBackdrop: true,
      panelClass: 'custom-img-pop-up',
      data: {
        imgIndex: index,
        images: this.images
      }
    });
  }

  editViolation(): void {
    this.editMode = true;
    this.addViolationForm.controls.violationLevel.enable();
    this.addViolationForm.controls.violationDescription.enable();
    this.addViolationForm.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
      this.isInitialDataChanged =
        this.initialData.violationLevel !== value.violationLevel || this.initialData.violationDescription !== value.violationDescription;
    });
  }

  deleteViolation(): void {
    const matDialogRef = this.dialog.open(DialogPopUpComponent, {
      data: this.deleteDialogData,
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: true,
      panelClass: ''
    });

    matDialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((res) => {
        if (res) {
          this.isDeleting = true;
          this.orderService.deleteViolationOfCurrentOrder(this.orderId).subscribe(() => {
            this.dialogRef.close(-1);
          });
        }
      });
  }

  deleteChanges(): void {
    const matDialogRef = this.dialog.open(DialogPopUpComponent, {
      data: this.clearChangesDialogData,
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: true,
      panelClass: ''
    });

    matDialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((res) => {
        if (res) {
          this.dialogRef.close();
        }
      });
  }

  deleteImage(i: number): void {
    if (this.editMode && i >= this.imagesFromDBLength) {
      this.imgArray.splice(i - this.imagesFromDBLength, 1);
      this.isInitialImageDataChanged = this.initialData.initialImagesLength !== this.imagesFromDBLength || this.imgArray.length > 0;
    }
    if (this.editMode && i < this.imagesFromDBLength) {
      this.imagesFromDBLength--;
      this.deletedImages.push(this.imagesFromDB[i]);
      this.imagesFromDB.splice(i, 1);
      this.isInitialImageDataChanged = true;
    }
    if (!this.editMode) {
      this.imgArray.splice(i, 1);
    }
    this.images.splice(i, 1);
    this.images.push({ src: null, label: this.isLabel ? null : this.dragAndDropLabel, name: null });
    this.isLabel = true;
  }

  assignLabel(): void {
    let attachLabel = true;
    for (let i = 0; i < this.images.length; i++) {
      if (i === 0 && !this.images[i].src) {
        this.images[i].label = this.dragAndDropLabel;
      }
      if (!attachLabel) {
        this.images[i].label = null;
        continue;
      }
      if (i > 0 && !this.images[i].src && this.images[i - 1].src) {
        this.images[i].label = this.dragAndDropLabel;
        attachLabel = false;
      }
    }
  }

  initImages(): void {
    for (let i = 0; i < this.maxNumberOfImgs; i++) {
      this.images.push({ src: null, label: null, name: null });
    }
    this.images[0].label = this.dragAndDropLabel;
    this.isLabel = true;
  }

  closeDialog() {
    if (this.isInitialDataChanged || this.isInitialImageDataChanged) {
      this.deleteChanges();
    } else {
      this.dialogRef.close();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
