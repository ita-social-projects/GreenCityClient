import { Component, Input, OnInit } from '@angular/core';
import { ecoNewsIcons } from 'src/app/image-pathes/profile-icons';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {

  @Input() searchModel;
  profileIcons = ecoNewsIcons;

  constructor() { }

  ngOnInit() {
    console.log(this.searchModel);
  }

}
