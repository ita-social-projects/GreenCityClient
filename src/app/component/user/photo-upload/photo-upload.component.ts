import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FileUploader} from 'ng2-file-upload';
import {HttpClient} from '@angular/common/http';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import {Observable} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {Photo} from '../../../model/photo/photo';

@Component({
  selector: 'app-photo-upload',
  templateUrl: './photo-upload.component.html',
  styleUrls: ['./photo-upload.component.scss']
})
export class PhotoUploadComponent implements OnInit {
  @Output() listOfPhotos = new EventEmitter();
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

  public uploader: FileUploader = new FileUploader({
    isHTML5: true
  });

  constructor(private fb: FormBuilder, private http: HttpClient, private db: AngularFirestore, private storage: AngularFireStorage) {
  }

  uploadSubmit() {
    for (let i = 0; i < this.uploader.queue.length; i++) {
      const fileItem = this.uploader.queue[i]._file;
      if (fileItem.size > 10000000) {
        alert('Each File should be less than 10 MB of size.');
        return;
      }
    }
    for (let j = 0; j < this.uploader.queue.length; j++) {
      const fileItem = this.uploader.queue[j]._file;
      console.log(fileItem.name);
      const path = `disc/${new Date().getTime()}_${fileItem.name}`;
      this.task = this.storage.upload(path, fileItem);
      this.photoLinks.push({name: path});
      console.log(path);
      this.percentage = this.task.percentageChanges();
      this.snapshot = this.task.snapshotChanges();

      this.task.snapshotChanges().pipe(finalize(() => this.downloadURL = this.storage.ref(path).getDownloadURL()
      )).subscribe(value => {
        console.log(this.downloadURL);
        console.log(value);
      });

    }
    console.log(this.photoLinks);
    this.uploader.clearQueue();
    this.listOfPhotos.emit(this.photoLinks);
    this.done === true;
  }

  ngOnInit() {
    this.uploadForm = this.fb.group({
      document: [null, null]
    });
    this.uploadForm.valueChanges.subscribe(dt => this.fieldChanges());
    // if(this.uploader.queue.length > 5){
    //   !this.uploadForm.valid;
    // }
  }

  fieldChanges() {
    this.showTable = false;
    let document = this.uploadForm.controls['document'] && this.uploadForm.controls['document'].value || '';
    if (this.photoLinks['document'] !== document.trim()) {
      this.showTable = true;
    }
  }
}
