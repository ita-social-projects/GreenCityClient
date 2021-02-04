import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ShareFormService } from '../../services/share-form.service';

@Component({
  selector: 'app-personal-data-form',
  templateUrl: './personal-data-form.component.html',
  styleUrls: ['./personal-data-form.component.scss']
})
export class PersonalDataFormComponent implements OnInit {
  personalDataForm: FormGroup;
  object: {};

  constructor(private fb: FormBuilder,
              private _shareFormService: ShareFormService) { }

  ngOnInit(): void {
    this.personalDataForm = this.fb.group({});
    this._shareFormService.objectSource.subscribe(object => {this.object = object; console.log(this.object);});
  }

}
