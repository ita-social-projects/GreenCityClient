import { Component, OnDestroy, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FileHandle } from '../../models/file-handle.model';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { ShowImgsPopUpComponent } from '../shared/components/show-imgs-pop-up/show-imgs-pop-up.component';

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
  isDeleteViolation = false;
  isLabel: boolean;
  dragAndDropLabel;
  addViolationForm: FormGroup;
  orderId;
  name: string;
  imgArray = [];
  public date = new Date();
  unsubscribe: Subject<any> = new Subject();
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
  }

  @ViewChild('takeInput') InputVar: ElementRef;

  ngOnInit() {
    this.translate
      .get('add-violation-modal.drag-photo')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((value) => {
        this.dragAndDropLabel = value;
      });
    this.initImages();
    this.initForm();
    this.localeStorageService.firstNameBehaviourSubject.pipe(takeUntil(this.unsubscribe)).subscribe((firstName) => {
      this.name = firstName;
    });
  }

  private initForm(): void {
    this.addViolationForm = this.fb.group({
      violationLevel: ['LOW', [Validators.required]],
      violationDescription: ['', [Validators.required, Validators.maxLength(255)]]
    });
  }

  prepareDataToSend(dto: string, image?: string): FormData {
    const { violationLevel, violationDescription } = this.addViolationForm.value;
    const data = {
      orderID: this.orderId,
      violationDescription,
      violationLevel
    };
    const formData: FormData = new FormData();
    const stringifiedDataToSend = JSON.stringify(data);
    formData.append(dto, stringifiedDataToSend);
    for (const images of this.imgArray) {
      formData.append('files', images);
    }
    return formData;
  }

  send() {
    const dataToSend = this.prepareDataToSend('add');
    this.orderService
      .addViolationToCurrentOrder(dataToSend)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.dialogRef.close();
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

  deleteViolation(): void {
    // TODO: Add logic to delete violations
  }

  deleteImage(i: number): void {
    this.imgArray.splice(i, 1);
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

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
