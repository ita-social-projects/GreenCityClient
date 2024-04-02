import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { Photo } from '../../../../model/photo/photo';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { environment } from '@environment/environment';

@Component({
  selector: 'app-photo-upload',
  templateUrl: './photo-upload.component.html',
  styleUrls: ['./photo-upload.component.scss']
})
export class PhotoUploadComponent implements OnInit {
  @Output() listOfPhotos = new EventEmitter();
  @Output() loadingStatus = new EventEmitter();
  @Input() countOfPhotos = 0;
  task: AngularFireUploadTask;
  uploadForm: UntypedFormGroup;

  // Progress monitoring
  percentage: Observable<number>;

  snapshot: Observable<any>;

  // Download URL
  downloadURL: Observable<string>;

  photoLinks: Photo[] = [];

  showTable: boolean;

  done: boolean;

  imgPath: string;

  loadingUpload = false;
  doneUpload = false;

  uploadButton = true;

  private storageBucket = environment.firebaseConfig.storageBucket;

  public uploader: FileUploader = new FileUploader({
    url: '',
    isHTML5: true
  });

  constructor(
    private fb: UntypedFormBuilder,
    private http: HttpClient,
    private matSnackBar: MatSnackBarComponent,
    private db: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  uploadSubmit() {
    // tslint:disable-next-line:prefer-for-of
    for (const upqueue of this.uploader.queue) {
      const fileItem = upqueue._file;
      if (fileItem.type !== 'image/png' && fileItem.type !== 'image/jpg' && fileItem.type !== 'image/jpeg' && fileItem.size > 10000000) {
        this.loadingUpload = false;
        this.matSnackBar.openSnackBar('cafeNotificationsPhotoUpload');
        return;
      }
    }
    this.loadingStatus.emit();
    this.loadingUpload = true;
    for (let j = 0; j < this.uploader.queue.length; j++) {
      const fileItem = this.uploader.queue[j]._file;
      const path = `${new Date().getTime()}_${fileItem.name}`;
      this.task = this.storage.upload(path, fileItem);
      if (j === this.uploader.queue.length - 1) {
        this.task.snapshotChanges().subscribe((value) => {
          if (value.bytesTransferred === value.totalBytes) {
            this.loadingUpload = false;
            this.doneUpload = true;
            this.loadingStatus.emit();
          }
        });
      }
      this.photoLinks.push({
        name: `https://firebasestorage.googleapis.com/v0/b/${this.storageBucket}/o/` + path + '?alt=media'
      });
    }
    this.listOfPhotos.emit(this.photoLinks);
    this.uploadButton = false;
  }

  ngOnInit() {
    this.uploadForm = this.fb.group({
      document: [null, null]
    });
    this.uploadForm.valueChanges.subscribe((dt) => this.fieldChanges());
  }

  fieldChanges() {
    this.showTable = false;
    const DOCUMENT = 'document';
    const document = (this.uploadForm.controls[DOCUMENT] && this.uploadForm.controls[DOCUMENT].value) || '';
    if (this.photoLinks[DOCUMENT] !== document.trim()) {
      this.showTable = true;
    }
  }
}
