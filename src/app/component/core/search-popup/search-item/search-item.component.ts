import {Component, OnInit} from '@angular/core';
import { ecoNewsIcons } from '../../../../../assets/img/icon/econews/profile-icons';

@Component({
  selector: 'app-search-item',
  templateUrl: './search-item.component.html',
  styleUrls: ['./search-item.component.scss']
})
export class SearchItemComponent implements OnInit {
  profileIcons = ecoNewsIcons;
  defaultPicture = ecoNewsIcons;

  constructor() { }

  ngOnInit() {
  }

}
