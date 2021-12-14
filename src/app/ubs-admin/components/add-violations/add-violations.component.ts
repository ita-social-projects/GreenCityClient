import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FileHandle } from '../../models/file-handle.model';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-add-violations',
  templateUrl: './add-violations.component.html',
  styleUrls: ['./add-violations.component.scss']
})
export class AddViolationsComponent implements OnInit, OnDestroy {
  images = [];
  files = [];
  isImageSizeError = false;
  isImageTypeError = false;
  dragAndDropLabel;
  addViolationForm: FormGroup;
  orderId;
  imgArray = [];
  unsubscribe: Subject<any> = new Subject();
  constructor(
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder,
    private orderService: OrderService,
    public dialogRef: MatDialogRef<AddViolationsComponent>
  ) {
    this.orderId = data.id;
  }

  ngOnInit() {
    this.translate
      .get('add-violation-modal.drag-photo')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((value) => {
        this.dragAndDropLabel = value;
      });
    this.initImages();
    this.initForm();
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
    this.transferFile(imageFile);
  }

  private transferFile(imageFile: File): void {
    if (!this.isImageTypeError) {
      const reader: FileReader = new FileReader();
      // this.selectedFile = imageFile;
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
        this.images[i + 1].label = this.dragAndDropLabel;
        this.images[i].name = name;
        break;
      }
    }
  }

  deleteAllImages(): void {
    for (const img of this.images) {
      img.src = null;
      img.label = '';
      img.name = null;
    }
    this.images[0].label = this.dragAndDropLabel;
  }

  deleteImage(i: number): void {
    this.images.splice(i, 1);
    this.images.push({ src: null, label: null, name: null });
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
    for (let i = 0; i < 6; i++) {
      this.images.push({ src: null, label: null, name: null });
    }
    this.images[0].label = this.dragAndDropLabel;
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
