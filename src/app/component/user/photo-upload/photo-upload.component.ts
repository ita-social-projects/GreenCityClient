import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FileUploader} from 'ng2-file-upload';
import {HttpClient} from '@angular/common/http';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import {Observable} from 'rxjs';
import {Photo} from '../../../model/photo/photo';

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
  uploadForm: FormGroup;

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

  public uploader: FileUploader = new FileUploader({
    isHTML5: true
  });

  constructor(private fb: FormBuilder, private http: HttpClient, private db: AngularFirestore, private storage: AngularFireStorage) {

  }

  uploadSubmit() {
    for (let i = 0; i < this.uploader.queue.length; i++) {
      const fileItem = this.uploader.queue[i]._file;
      if (fileItem.type !== 'image/png' && fileItem.type !== 'image/jpeg') {
        this.loadingUpload = false;
        alert('Each File should be png or jpeg.');
        return;
      }
      if (fileItem.size > 10000000) {
        this.loadingUpload = false;
        alert('Each File should be less than 10 MB of size.');
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
        this.task.snapshotChanges().subscribe(value => {
          if (value.bytesTransferred === value.totalBytes) {
            this.loadingUpload = false;
            this.doneUpload = true;
            this.loadingStatus.emit();
          }
        });
      }
      this.photoLinks.push({name: 'https://firebasestorage.googleapis.com/v0/b/greencity-9bdb7.appspot.com/o/' + path + '?alt=media'});
    }
    this.listOfPhotos.emit(this.photoLinks);
    this.uploadButton = false;
  }

  ngOnInit() {
    this.uploadForm = this.fb.group({
      document: [null, null]
    });
    this.uploadForm.valueChanges.subscribe(dt => this.fieldChanges());
  }

  fieldChanges() {
    this.showTable = false;
    let document = this.uploadForm.controls['document'] && this.uploadForm.controls['document'].value || '';
    if (this.photoLinks['document'] !== document.trim()) {
      this.showTable = true;
    }
  }
}
