import { Component, OnInit, ViewChild, ElementRef, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileHandle } from '../../models/file-handle.model';
import { iif, of, Subject } from 'rxjs';
import { switchMap, take, takeUntil } from 'rxjs/operators';
import { OrderService } from '../../services/order.service';
import { ShowImgsPopUpComponent } from '../../../../shared/show-imgs-pop-up/show-imgs-pop-up.component';

interface NotTakenOutReasonImage {
  src: string;
  name: string | null;
  file: File;
}

interface DataToSend {
  description: string;
  images?: string[] | null;
}

@Component({
  selector: 'app-add-order-not-taken-out-reason',
  templateUrl: './add-order-not-taken-out-reason.component.html',
  styleUrls: ['./add-order-not-taken-out-reason.component.scss']
})
export class AddOrderNotTakenOutReasonComponent implements OnInit {
  closeButton = './assets/img/profile/icons/cancel.svg';
  date = new Date();
  public notTakenOutReason: string;
  public adminName;
  private isUploading = false;
  public addNotTakenOutForm: FormGroup;
  unsubscribe: Subject<any> = new Subject();
  maxNumberOfImgs = 6;
  name: string;
  id;
  isImageSizeError = false;
  isImageTypeError = false;
  images: NotTakenOutReasonImage[] = [];
  imagesToDelete: string[] | null = [];
  imageSizeLimit = 10485760;
  private destroySub: Subject<boolean> = new Subject<boolean>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private localStorageService: LocalStorageService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private orderService: OrderService,
    public dialogRef: MatDialogRef<AddOrderNotTakenOutReasonComponent>
  ) {
    this.id = data.id;
  }

  ngOnInit(): void {
    this.initForm();
    this.localStorageService.firstNameBehaviourSubject.pipe(takeUntil(this.unsubscribe)).subscribe((firstName) => {
      this.adminName = firstName;
    });
  }
  public initForm(): void {
    this.addNotTakenOutForm = this.fb.group({
      notTakenOutReason: ['', [Validators.required, Validators.maxLength(255)]]
    });
  }

  loadFiles(files: File[]): void {
    if (this.images.length + files.length > this.maxNumberOfImgs) {
      return;
    }

    this.isImageSizeError = false;
    this.isImageTypeError = false;
    files.forEach((file) => {
      this.isImageTypeError = !this.validateFileExtension(file);
      this.isImageSizeError = !this.validateFileSize(file);
      if (this.isImageTypeError || this.isImageSizeError) {
        return;
      }
      this.transferFile(file);
    });
  }

  validateFileExtension(file: File) {
    return file.type === 'image/jpeg' || file.type === 'image/png';
  }

  validateFileSize(file: File) {
    return file.size <= this.imageSizeLimit;
  }

  private transferFile(imageFile: File): void {
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onload = () => {
      this.images.push({ src: reader.result as string, name: imageFile.name, file: imageFile });
    };
  }

  onFilesDropped(fileHandles: FileHandle[]): void {
    const files = fileHandles.map((handle) => handle.file);
    this.loadFiles(files);
  }

  onFilesSelected(event: any): void {
    this.loadFiles([...event.target.files]);
  }

  openImg(image: NotTakenOutReasonImage): void {
    this.dialog.open(ShowImgsPopUpComponent, {
      hasBackdrop: true,
      panelClass: 'custom-img-pop-up',
      data: {
        imgIndex: this.images.indexOf(image),
        images: this.images.map((img) => ({ src: img.src }))
      }
    });
  }

  deleteImage(imageToDelete: NotTakenOutReasonImage): void {
    const isUploaded = imageToDelete.file === null;
    if (isUploaded) {
      this.imagesToDelete.push(imageToDelete.src);
    }
    this.images = this.images.filter((image) => image !== imageToDelete);
  }

  prepareDataToSend() {
    const notTakenOutReason = this.addNotTakenOutForm.value.notTakenOutReason;

    let formData = new FormData();
    //console.log(this.images);
    //console.log(this.images[0], this.images[0].file);

    this.images.forEach((image) => {
      if (image.file) {
        formData.append('images', image);
      }
    });

    const str = JSON.stringify(formData);
    const data: DataToSend = {
      description: notTakenOutReason
      //images: [formData]
    };
    const stringifiedDataToSend = JSON.stringify(data);

    console.log(data);

    return data;
  }

  public send(): void {
    this.isUploading = true;
    let dataToSend = this.prepareDataToSend();
    of(true)
      .pipe(
        switchMap(() => this.orderService.addReasonForNotTakenOutOrder(dataToSend, this.id)),
        takeUntil(this.unsubscribe)
      )
      .subscribe(() => {
        this.dialogRef.close(1);
      });
  }

  public close(): void {
    const res = {
      action: 'cancel'
    };
    this.dialogRef.close(res);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
