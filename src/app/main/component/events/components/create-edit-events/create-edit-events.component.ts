import { Component, ElementRef, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-create-edit-events',
  templateUrl: './create-edit-events.component.html',
  styleUrls: ['./create-edit-events.component.scss']
})
export class CreateEditEventsComponent implements OnInit {
  InputVar: ElementRef;
  public form: FormGroup;
  image = {
    src: null,
    label: null,
    name: null
  };
  title = '';
  titles = [{ title: '' }];
  imgArray = [];
  dragAndDropLabel = 'value';
  maxNumberOfImgs = 1;

  isImageSizeError = false;
  isImageTypeError = false;
  isLabel = false;
  range: any;
  picker: any;

  constructor(private eventService: EventsService, private route: ActivatedRoute) {}

  ngOnInit(): void {}

  createEvent() {
    console.log('click');
    this.eventService.createEvent().subscribe((val) => console.log(val));
  }

  loadFile(event): void {
    const imageFile = (event.target as HTMLInputElement).files[0];
    this.transferFile(imageFile);
    console.log(this.title);
  }

  private transferFile(imageFile: File): void {
    if (!this.isImageTypeError) {
      const reader: FileReader = new FileReader();
      this.imgArray.push(imageFile);
      reader.readAsDataURL(imageFile);
      reader.onload = () => {
        this.assignImage(reader.result, imageFile.name);
      };
      // if (this.editMode) {
      //   this.isInitialImageDataChanged = true;
      // }
    }
  }

  assignImage(result: any, name: string): void {
    this.image.label = this.dragAndDropLabel;
    this.image.src = result;
    this.image.name = name;
  }

  deleteImage() {
    this.image = {
      src: null,
      label: null,
      name: null
    };
    this.imgArray = [];
  }

  getDate(event) {
    console.log(event);
  }

  addDate() {
    this.titles.push({ title: '' });
  }

  showPicker(ev) {
    console.log(ev);
  }

  onSubmit() {}
}
