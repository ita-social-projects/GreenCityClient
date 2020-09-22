import { Component, OnInit } from '@angular/core';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-news-details-form',
  templateUrl: './news-details-form.component.html',
  styleUrls: ['./news-details-form.component.scss']
})
export class NewsDetailsFormComponent implements OnInit {

  title = this.fb.control('');
  source = this.fb.control('');
  content = this.fb.control('');
  tags = this.fb.control([]);
  image = this.fb.control('');

  formGroup = this.fb.group({
    title: this.title,
    source: this.source,
    content: this.content,
    tags: this.tags,
    image: this.image,
  });

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
  }

}
