import { Component, Input } from '@angular/core';
import { ecoNewsIcons } from 'src/app/image-pathes/profile-icons';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent {

  @Input() searchModel;
  profileIcons = ecoNewsIcons;

}
