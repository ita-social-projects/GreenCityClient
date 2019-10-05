import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FileUploader} from 'ng2-file-upload';
import {HttpClient} from '@angular/common/http';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import {Observable} from 'rxjs';
import {Photo} from '../../../model/photo/photo';

@Component({
  selector: 'app-upload-photo',
  templateUrl: './upload-photo.component.html',
  styleUrls: ['./upload-photo.component.css']
})
export class UploadPhotoComponent implements OnInit {
  @Output() listOfPhotos = new EventEmitter();
  task: AngularFireUploadTask;
  uploadForm: FormGroup;
  // Progress monitoring
  percentage: Observable<number>;
  snapshot: Observable<any>;
  // Download URL
  downloadURL: Observable<string>;
  photoLinks: Photo[] = [];
  rating: number;
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
      const data = new FormData();
      const fileItem = this.uploader.queue[j]._file;
      console.log(fileItem.name);
      // data.append('file', fileItem);
      // data.append('fileSeq', 'seq' + j);
      // data.append('dataType', this.uploadForm.controls.type.value);
      // this.uploadFile(data).subscribe(data => alert(data.message));
      const path = `disc/${new Date().getTime()}_${fileItem.name}`;
      // this.task = this.storage.upload(path, fileItem);
      const reference = this.storage.storage.ref().child(path);
      console.log('log');
      // console.log(reference.getDownloadURL().);
      // reference.child(fileItem.name);
      reference.put(fileItem).then(a => {
        console.log(a);
      });
      // this.photoLinks.push({name: path});
      // console.log(path);
      // this.percentage = this.task.percentageChanges();
      // this.snapshot = this.task.snapshotChanges();
      //
      // // this.snapshot = this.task.snapshotChanges().pipe(
      // //   tap(snap => {
      // //     if (snap.bytesTransferred === snap.totalBytes) {
      // //       // Update firestore on completion
      // //       console.log(snap.totalBytes);
      // //       this.db.collection('photos').add({path, size: snap.totalBytes});
      // //     }
      // //   })
      // // );
      // this.task.snapshotChanges().pipe(finalize(() => this.downloadURL = this.storage.ref(path).getDownloadURL()
      // )).subscribe(value => {
      //   console.log(this.downloadURL);
      //   console.log(value);
      // });
    }
    console.log(this.photoLinks);
    this.uploader.clearQueue();
    this.listOfPhotos.emit(this.photoLinks);
  }

  // uploadFile(data: FormData): Observable {
  //   return this.http.post('http://localhost:8080/upload', data);
  // }

  ngOnInit() {
    this.uploadForm = this.fb.group({
      document: [null, null],
      type: [null, Validators.compose([Validators.required])]
    });
  }
}
